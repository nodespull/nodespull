"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipe = exports.Hash = exports.Session = void 0;
const hash_1 = require("../etc/system-tools/hash");
const jwt_1 = require("../route/auth/jwt");
const log_1 = require("../etc/log");
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
        this._pipeServices = [];
        this._consumed = []; // pipe services that ran forward
        this._callback = (result, error) => { };
    }
    /**
     * run only forward functions in the pipe
     */
    forwardOnly() {
        this._forwardOnly = true;
        return this;
    }
    /**
     * do not stop pipe flow if an exception occurs
     */
    ignoreExceptions() {
        this._ignoreExceptions = true;
        return this;
    }
    setFunctions(...args) {
        for (let service of args) {
            if (!service.functions.forward || !service.functions.backward) {
                new log_1.Log(`non pipe-usable service '${service.selector}' - missisng 'forward' or 'backward' function`).throwError();
                process.exit(1);
            }
        }
        this._pipeServices = args;
        return this;
    }
    /**
     * runs req and res objects through a list of pipe functions
     * @return {any|Error} any data returned from the last function, or the first Error encountered in the pipe
     */
    run(callback) {
        this._callback = callback;
        this._forwardFlow(null);
    }
    /**
     * defines the flow of the pipe -- service call order
     */
    _forwardFlow(data) {
        if (data instanceof Error) {
            if (!this._ignoreExceptions) {
                if (this._forwardOnly)
                    this._callback(null, data);
                else
                    this._backwardFlow(data);
            }
        }
        else {
            let service = this._pipeServices.shift();
            if (service) {
                this._consumed.push(service);
                service.functions.forward(this.req, this.res, this._forwardFlow, data);
            }
            else
                this._callback(data, null);
        }
    }
    _backwardFlow(error) {
        let service = this._consumed.pop();
        if (service)
            service.functions.backward(this.req, this.res, this._backwardFlow, error);
        else
            this._callback(null, error);
    }
}
exports.Pipe = Pipe;
