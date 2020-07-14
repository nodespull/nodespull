
import {Hash_Sha} from "../etc/system-tools/hash"
import {JWT} from "../route/auth/jwt"
import {json} from "./type/sys"


/**
 * Create a client session that stores data
 * @param data any information you'd like to save 
 * @param duration optional session duration, default: "24h". Example:
 * ```
 *      let session = new Session({
 *          id: 1,
 *          name: "user_wonderful"
 *      }, "24h")
 *      let jwt = session.getJWToken();
 *      let dur = session.getDuration();
 * ```
 */
export class Session{
    jwt:string;
    duration:string;
    /**
     * 
     * @param data 
     * @param duration 
     */
    constructor(data:json, duration:string){
        let res = JWT.sign(data, duration);
        this.jwt = res.token;
        this.duration = res.duration
    }
    /**
     * @returns {string} JWT that carries session data
     */
    getJWToken():string{return this.jwt;}
    /**
     * @returns {string} duration of the session
     */
    getDuration():string{return this.duration;}
}


/**
 * Create a session that stores data
 * @param str string to hash
 * Example:
 * ```
 *      let hash = new Hash("my_password").getValue();
 * ```
 */
export class Hash{
    value:string;
    constructor(string:string){
        this.value = Hash_Sha.sha256(string);
    }
    /**
     * @returns {string} hash value
     */
    getValue():string{return this.value;}
}



/**
 * Runs req and res objects through a series of np functions
 * @param {Request} req client request object
 * @param {Response} res client response object
 * Example:
 * ```
 *      let pipeRes = new Pipe(req, res).setFunctions( 
 *          func.myFunction1, 
 *          func.myFunction2
 *      ).run()
 * ```
 */
export class Pipe{
    private _forwardOnly: boolean = false
    private _ignoreExceptions: boolean = false
    private _functions:any[] = []

    constructor(public req:Request, public res:Response){
    }

    /**
     * run only forward functions in the pipe
     */
    forwardOnly(){
        this._forwardOnly = true
    }

    /**
     * do not stop pipe flow if an exception occurs
     */
    ignoreExceptions(){
        this._ignoreExceptions = true
    }

    setFunctions(...args: any[]){
        this._functions = args
    }

    /**
     * runs req and res objects through a list of pipe functions
     * @return {any|Error} any data returned from the last function, or the first Error encountered in the pipe
     */
    run(){
        let consumed: any[] = [] // pipe functions that ran forward
        let forwardResult
        for(let pipefunc of this._functions){
            forwardResult = pipefunc.forward(this.req, this.res)
            consumed.push(pipefunc)
            if(forwardResult instanceof Error){
                if(this._ignoreExceptions) continue
                else {
                    if(this._forwardOnly)return forwardResult
                    let backwardResult = forwardResult
                    for(let consumedPipeFunc of consumed){
                        backwardResult = consumedPipeFunc.backward(this.req, this.res, backwardResult)
                    }
                    return backwardResult
                }
            }
        }
        return forwardResult
    }
}