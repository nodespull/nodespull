"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
