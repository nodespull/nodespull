"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hash_Algorithm = void 0;
const hash_js_1 = __importDefault(require("hash.js"));
class Hash_Algorithm {
    //cb with hashed equivalent
    static sha256(text) {
        return hash_js_1.default.sha256().update(text).digest("hex");
    }
    static sha512(text) {
        return hash_js_1.default.sha512().update(text).digest("hex");
    }
}
exports.Hash_Algorithm = Hash_Algorithm;
