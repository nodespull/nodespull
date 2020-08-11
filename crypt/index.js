"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAlg = exports.DurationInstance = exports.Duration = exports.hash = exports.jwt = exports.AuthController = void 0;
const string_validator_1 = require("../etc/system-tools/string-validator");
const jwt_1 = require("./models/jwt");
const oauth2_1 = require("./models/oauth2");
const hash_1 = require("../etc/system-tools/hash");
let AuthController = /** @class */ (() => {
    class AuthController {
        static jwt(args) {
            string_validator_1.StringParser.convertToExtendedAlphaNum_orThrow(args.selector, `expected jwt selector '${args.selector}' as an alphanumeric`);
            AuthController._profiles.jwt[args.selector] = new jwt_1.npJWT(args);
        }
        static oauth2(args) {
            string_validator_1.StringParser.convertToExtendedAlphaNum_orThrow(args.selector, `expected jwt selector '${args.selector}' as an alphanumeric`);
            AuthController._profiles.oauth2[args.selector] = new oauth2_1.npOauth2(args);
        }
    }
    AuthController._profiles = { jwt: {}, oauth2: {} };
    return AuthController;
})();
exports.AuthController = AuthController;
exports.jwt = AuthController._profiles.jwt;
exports.hash = {
    SHA256: { createWIth: (str) => { return hash_1.Hash_Algorithm.sha256(str); } },
    SHA512: { createWIth: (str) => { return hash_1.Hash_Algorithm.sha512(str); } }
};
class Duration {
    static sec(num) { return new DurationInstance(num); }
    static min(num) { return new DurationInstance(num * 60); }
    static hour(num) { return new DurationInstance(num * 60 * 60); }
    static day(num) { return new DurationInstance(num * 60 * 60 * 24); }
}
exports.Duration = Duration;
class DurationInstance {
    constructor(duration_sec) {
        this.duration_sec = duration_sec;
    }
    sec(num) { this.duration_sec + num; return this; }
    min(num) { this.duration_sec + (num * 60); return this; }
    hour(num) { this.duration_sec + (num * 60 * 60); return this; }
    day(num) { this.duration_sec + (num * 60 * 60 * 24); return this; }
}
exports.DurationInstance = DurationInstance;
var JwtAlg;
(function (JwtAlg) {
    JwtAlg["HS256"] = "hs256";
})(JwtAlg = exports.JwtAlg || (exports.JwtAlg = {}));
