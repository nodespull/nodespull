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
Object.defineProperty(exports, "__esModule", { value: true });
const exe_log_1 = require("../exe/exe.log");
const randWords = require("random-words");
//log into heroku
function login() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exe_log_1.cmd("heroku", ["login", "-i"], false);
    });
}
exports.login = login;
//create app
function create() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exe_log_1.cmd("heroku", ["create"], false);
    });
}
exports.create = create;
//push
function push() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exe_log_1.cmd("git", ["push", "heroku", "master"], false);
        yield exe_log_1.cmd("heroku", ["open"], false);
    });
}
exports.push = push;
