
import jwt from "jsonwebtoken"
import { JwtAuthProfileInterface, npJWTGuard } from "./interface";
import { Log } from "../../etc/log";


export class npJWT{
    

    constructor(private _args: JwtAuthProfileInterface){}

    /**
     * a JWT Guard is used to protect a route or all routes in a npModule.
     * it will require that a bearer jwt, created with this profile, be passed in the Authorization
     * field of the request's header
     */
    getGuard():npJWTGuard{
        return this
    }

    /**
     * generate a jwt using this jwt profile
     * @param userData data to be stored in the token
     */
    createTokenWith(userData:object):string{
        let token:string
        switch(this._args.algorithm){
            case(JWTAlgType.HS256): token = JWTAlgModel.HS256.sign(userData, this._args)
            default: token = JWTAlgModel.HS256.sign(userData, this._args)
        }
        return token
    }


    /**
     * verify that a jwt is provided and is valid
     * use configs to decide next action: return to client or pass to route handler
     */
    verifyToken(req:any, res:any, next:Function){
        let checkConfigAndReply = (err:any, decoded:any)=>{
            req["jwt"]["data"] = decoded
            let completeTask = ()=>{
                if(err && !this._args.onError.continueToRoute){
                    let response = res.status(this._args.onError.statusCode)
                    if(this._args.onError.json) response.json(this._args.onError.json)
                    else response.send()
                }
                else next()
            }
            if(this._args.onFinish) this._args.onFinish(req, decoded, err, completeTask)
            else completeTask()
        }
        let authorization = req.header("Authorization")
        let token = authorization?req.header("Authorization").split(" ")[1]:undefined; //remove 'Bearer'
        if(token) {
            switch(this._args.algorithm){
                case(JWTAlgType.HS256): JWTAlgModel.HS256.verify(token, this._args, checkConfigAndReply)
                default: token = JWTAlgModel.HS256.verify(token, this._args, checkConfigAndReply)
            }
        }
        else checkConfigAndReply(new Error("Authorization Token not found"), null)
    };
    

}


/**
 * list of jwt algorithms
 */
export enum JWTAlgType{
    HS256 = "hs256"
}


/**
 * implementation of JWT algorithms
 */
class JWTAlgModel {
    
    static HS256 = {
        beforeAll: (args:JwtAuthProfileInterface)=>{
            if(!args.secret) new Log("secret not provided for auth profile using jwt 'HS256'").throwError()
        },
        sign: (data:object, args:JwtAuthProfileInterface):string=>{
            JWTAlgModel.HS256.beforeAll(args)
            return jwt.sign(data, args.secret!, {expiresIn: args.expiresIn})   
        },
        verify: (token:string, args:JwtAuthProfileInterface, callback:Function):void=>{
            JWTAlgModel.HS256.beforeAll(args)
            jwt.verify(token, args.secret!, (err:any, decoded:any) => callback(err, decoded))
        }
    }


}
