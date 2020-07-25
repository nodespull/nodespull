
import {Hash_Sha} from "../etc/system-tools/hash"
import {JWT} from "../route/auth/jwt"
import {json} from "./type/sys"
import { npServiceInterface } from "../module/v2-module/models";
import { Log } from "../etc/log";


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
    private _pipeServices:npServiceInterface[] = []
    private _consumed: npServiceInterface[] = [] // pipe services that ran forward
    private _callback:Function = (result:any,error:Error)=>{}

    constructor(public req:Request, public res:Response){
    }

    /**
     * run only forward functions in the pipe
     */
    forwardOnly():Pipe{
        this._forwardOnly = true
        return this
    }

    /**
     * do not stop pipe flow if an exception occurs
     */
    ignoreExceptions():Pipe{
        this._ignoreExceptions = true
        return this
    }

    setFunctions(...args: npServiceInterface[]):Pipe{
        for(let service of args) {
            if(!service.functions.forward || !service.functions.backward){
                new Log(`non pipe-usable service '${service.selector}' - missisng 'forward' or 'backward' function`).throwError()
                process.exit(1)
            }
        }
        this._pipeServices = args
        return this
    }

    /**
     * runs req and res objects through a list of pipe functions
     * @return {any|Error} any data returned from the last function, or the first Error encountered in the pipe
     */
    run(callback:Function){
        this._callback = callback
        this._forwardFlow(null)
    }

    /**
     * defines the flow of the pipe -- service call order
     */
    _forwardFlow(data:any){
        if(data instanceof Error){
            if(!this._ignoreExceptions){
                if(this._forwardOnly) this._callback(null, data)
                else this._backwardFlow(data)
            }
        }
        else{
            let service = this._pipeServices.shift()
            if(service){
                this._consumed.push(service)
                service.functions.forward(this.req, this.res, this._forwardFlow, data)
            }
            else this._callback(data, null)
        }
    }

    _backwardFlow(error:Error){
        let service = this._consumed.pop()
        if(service) service.functions.backward(this.req, this.res, this._backwardFlow, error)
        else this._callback(null, error)
    }
}