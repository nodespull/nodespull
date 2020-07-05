"use strict";
/**
 * Runs auto-generated route and table files
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recursiveRun = void 0;
const fs_1 = __importDefault(require("fs"));
const install_1 = require("./install");
const rootPath = __dirname + `/../../${install_1.appModule}/`;
recursiveRun(rootPath, "model.js");
recursiveRun(rootPath, "relation.js");
recursiveRun(rootPath, "module.js");
recursiveRun(rootPath, "func.js");
recursiveRun(rootPath, "delete.js");
recursiveRun(rootPath, "get.js");
recursiveRun(rootPath, "head.js");
recursiveRun(rootPath, "post.js");
recursiveRun(rootPath, "put.js");
/**
 * run all .js file recursively, given a folder
 */
function recursiveRun(path, extension) {
    try {
        const dirents = fs_1.default.readdirSync(path, { withFileTypes: true });
        const fileNames = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
        const folderNames = dirents
            .filter(dirent => !dirent.isFile())
            .map(dirent => dirent.name);
        for (let folderName of folderNames)
            recursiveRun(path + "/" + folderName, extension);
        for (let fileName of fileNames) {
            if (fileName.slice(-1 * (extension.length + 1)).toLowerCase() === "." + extension.toLowerCase())
                require(path + "/" + fileName);
        }
    }
    catch (_a) { }
}
exports.recursiveRun = recursiveRun;
