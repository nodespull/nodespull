"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInput = exports.cliStack = void 0;
const readline_1 = __importDefault(require("readline"));
const string_toUnicode_1 = require("./string-toUnicode");
exports.cliStack = [];
function userInput(question) {
    process.stdin.setEncoding('utf8');
    let cliStackIndex = exports.cliStack.length;
    const rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    process.stdin.on('data', listener);
    function listener(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (string_toUnicode_1.toUnicode(key) == "\\u001B\\u005B\\u0041") {
                writer((cliStackIndex < 1) ? 0 : cliStackIndex - 1);
            }
            else if (string_toUnicode_1.toUnicode(key) == '\\u001B\\u005B\\u0042') {
                writer((cliStackIndex < exports.cliStack.length) ? cliStackIndex + 1 : exports.cliStack.length);
            }
            else {
                process.stdin.removeListener('data', listener);
            }
        });
    }
    function writer(index) {
        cliStackIndex = index;
        rl.write(">>", { ctrl: true, name: 'u' });
        rl.write(exports.cliStack[index]);
    }
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
