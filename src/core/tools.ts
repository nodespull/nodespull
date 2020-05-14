
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
