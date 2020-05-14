"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class res {
    constructor() {
        this.clientResponse = new Promise((resolve, reject) => {
            this.runTest = resolve;
        });
    }
    toClient() {
        return this.clientResponse;
    }
    //setters
    send(text) {
        if (text)
            this._sendValue = text;
        else
            this._sendValue = true;
        if (this.runTest)
            this.runTest(); // run test
        return this;
    }
    json(json) {
        this._json = json;
        if (this.runTest)
            this.runTest(); // run test
        return this;
    }
    status(number) {
        this._status = number;
        return this;
    }
    //getters
    getStatusVal() {
        return this._status;
    }
    getJsonVal() {
        return this._json;
    }
    getSendVal() {
        return this._sendValue;
    }
}
exports.res = res;
