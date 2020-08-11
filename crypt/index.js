"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.jwt = exports.AuthController = void 0;
const string_validator_1 = require("../etc/system-tools/string-validator");
const jwt_1 = require("./models/jwt");
const oauth2_1 = require("./models/oauth2");
const hash_1 = require("../etc/system-tools/hash");
let AuthController = /** @class */ (() => {
    class AuthController {
        static jwt(args) {
            string_validator_1.StringParser.convertToExtendedAlphaNum_orThrow(args.selector, `expected jwt selector '${args.selector}' as an alphanumeric`);
            this._profiles.jwt[args.selector] = new jwt_1.npJWT(args);
        }
        static oauth2(args) {
            string_validator_1.StringParser.convertToExtendedAlphaNum_orThrow(args.selector, `expected jwt selector '${args.selector}' as an alphanumeric`);
            this._profiles.oauth2[args.selector] = new oauth2_1.npOauth2(args);
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
