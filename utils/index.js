"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hash = exports.oauth2 = exports.jwt = void 0;
const hash_1 = require("../etc/system-tools/hash");
const crypt_1 = require("../crypt");
exports.jwt = crypt_1.AuthController._profiles.jwt;
exports.oauth2 = crypt_1.AuthController._profiles.oauth2;
exports.hash = {
    SHA256: { createWith: (str) => { return hash_1.Hash_Algorithm.sha256(str); } },
    SHA512: { createWith: (str) => { return hash_1.Hash_Algorithm.sha512(str); } }
};
