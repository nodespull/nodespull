"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipe = exports.Hash = exports.Session = void 0;
const hash_1 = require("../etc/system-tools/hash");
const jwt_1 = require("../route/auth/jwt");
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
class Session {
    /**
     *
     * @param data
     * @param duration
     */
    constructor(data, duration) {
        let res = jwt_1.JWT.sign(data, duration);
        this.jwt = res.token;
        this.duration = res.duration;
    }
    /**
     * @returns {string} JWT that carries session data
     */
    getJWToken() { return this.jwt; }
    /**
     * @returns {string} duration of the session
     */
    getDuration() { return this.duration; }
}
exports.Session = Session;
/**
 * Create a session that stores data
 * @param str string to hash
 * Example:
 * ```
 *      let hash = new Hash("my_password").getValue();
 * ```
 */
class Hash {
    constructor(string) {
        this.value = hash_1.Hash_Sha.sha256(string);
    }
    /**
     * @returns {string} hash value
     */
    getValue() { return this.value; }
}
exports.Hash = Hash;
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
class Pipe {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this._forwardOnly = false;
        this._ignoreExceptions = false;
        this._functions = [];
    }
    /**
     * run only forward functions in the pipe
     */
    forwardOnly() {
        this._forwardOnly = true;
    }
    /**
     * do not stop pipe flow if an exception occurs
     */
    ignoreExceptions() {
        this._ignoreExceptions = true;
    }
    setFunctions(...args) {
        this._functions = args;
    }
    /**
     * runs req and res objects through a list of pipe functions
     * @return {any|Error} any data returned from the last function, or the first Error encountered in the pipe
     */
    run() {
        let consumed = []; // pipe functions that ran forward
        let forwardResult;
        for (let pipefunc of this._functions) {
            forwardResult = pipefunc.forward(this.req, this.res);
            consumed.push(pipefunc);
            if (forwardResult instanceof Error) {
                if (this._ignoreExceptions)
                    continue;
                else {
                    if (this._forwardOnly)
                        return forwardResult;
                    let backwardResult = forwardResult;
                    for (let consumedPipeFunc of consumed) {
                        backwardResult = consumedPipeFunc.backward(this.req, this.res, backwardResult);
                    }
                    return backwardResult;
                }
            }
        }
        return forwardResult;
    }
}
exports.Pipe = Pipe;
