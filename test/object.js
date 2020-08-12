"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npResponse = void 0;
class npResponse {
    constructor() {
        this._status = 200;
        this.callback = () => { };
        //setters
        this.status = (number) => {
            this._status = number;
            return this;
        };
    }
}
exports.npResponse = npResponse;
