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
const fs_1 = __importDefault(require("fs"));
const exe_log_1 = require("./exe/exe.log");
//initialize git
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exe_log_1.cmd("touch", [".gitignore"], false);
        fs_1.default.writeFile(".gitignore", "node_modules/", () => { });
        yield exe_log_1.cmd("git", ["init"], false);
    });
}
exports.init = init;
function commit() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exe_log_1.cmd("git", ["add", "."], false);
        yield exe_log_1.cmd("git", ["commit", "-m", "np-auto"], false);
    });
}
exports.commit = commit;
