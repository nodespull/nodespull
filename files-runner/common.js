"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesRunner = void 0;
const fs_1 = __importDefault(require("fs"));
const install_1 = require("../install");
// runner template
let FilesRunner = /** @class */ (() => {
    class FilesRunner {
        constructor() { }
        /**
         * run all .js file recursively, given a folder
         */
        recursiveRun(path, extension) {
            try {
                const dirents = fs_1.default.readdirSync(path, { withFileTypes: true });
                const fileNames = dirents
                    .filter(dirent => dirent.isFile())
                    .map(dirent => dirent.name);
                const folderNames = dirents
                    .filter(dirent => !dirent.isFile())
                    .map(dirent => dirent.name);
                for (let folderName of folderNames)
                    this.recursiveRun(path + "/" + folderName, extension);
                for (let fileName of fileNames) {
                    if (fileName.slice(-1 * (extension.length + 1)).toLowerCase() === "." + extension.toLowerCase())
                        require(path + "/" + fileName);
                }
            }
            catch (_a) { }
        }
    }
    FilesRunner.rootPath = __dirname + `/../../../${install_1.appModule}/`;
    return FilesRunner;
})();
exports.FilesRunner = FilesRunner;
