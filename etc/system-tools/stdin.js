"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInput = void 0;
const readline_1 = __importDefault(require("readline"));
function userInput(question) {
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let promise = new Promise(resolve => {
        rl.question(question, (ans) => {
            rl.close();
            resolve(ans);
        });
    });
    let toReturn = {
        _promise: promise,
        getPromise: () => { return toReturn["_promise"]; },
        interface: rl
    };
    return toReturn;
}
exports.userInput = userInput;
