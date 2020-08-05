"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
let errors = {
    db: {
        modelNotSaved,
        missingWhere_for
    }
};
exports.default = errors;
function modelNotSaved() {
    throw Error("Tried to get a Table before saving Tables to database");
}
function missingWhere_for(action) {
    throw Error("Missing where expression before " + action);
}
class Log {
    constructor(message) {
        this.message = message;
    }
    setValue(message) { this.message = message; return this; }
    getValue() { return this.message; }
    printValue() { console.log(this.message); }
    throwError() { console.error("\x1b[31m", new Error(this.message), "\x1b[37m"); }
    throwWarn() { console.warn("\x1b[33m", "\nWarn: " + this.message, "\x1b[37m"); }
    FgRed() { this.applyFgFormat("\x1b[31m"); return this; }
    FgGreen() { this.applyFgFormat("\x1b[32m"); return this; }
    FgYellow() { this.applyFgFormat("\x1b[33m"); return this; }
    FgBlue() { this.applyFgFormat("\x1b[34m"); return this; }
    FgMagenta() { this.applyFgFormat("\x1b[35m"); return this; }
    FgCyan() { this.applyFgFormat("\x1b[36m"); return this; }
    FgWhite() { this.applyFgFormat("\x1b[37m"); return this; }
    BgRed() { this.applyBgFormat("\x1b[41m"); return this; }
    BgGreen() { this.applyBgFormat("\x1b[42m"); return this; }
    BgYellow() { this.applyBgFormat("\x1b[43m"); return this; }
    BgBlue() { this.applyBgFormat("\x1b[44m"); return this; }
    BgMagenta() { this.applyBgFormat("\x1b[45m"); return this; }
    BgCyan() { this.applyBgFormat("\x1b[46m"); return this; }
    BgWhite() { this.applyBgFormat("\x1b[47m"); return this; }
    applyFgFormat(format) { this.message = format + this.message + "\x1b[37m"; }
    applyBgFormat(format) { this.message = format + this.message + "\x1b[40m"; }
}
exports.Log = Log;
