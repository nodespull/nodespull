"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npOauth2 = void 0;
class npOauth2 {
    constructor(_args) {
        this._args = _args;
    }
    /**
     * parse authorization code as defined in the profile
     */
    parse(authorization, callback) {
        this._args.onInit(authorization, callback);
    }
}
exports.npOauth2 = npOauth2;
