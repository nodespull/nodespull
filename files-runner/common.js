"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesEngine = void 0;
const fs_1 = __importDefault(require("fs"));
// runner template
class FilesEngine {
    // static appRootPath = PathVar.appModule //`${process.argv[1].split("/").slice(0,-1).join("/")}/../${appModule}`
    // static dbRootPath = PathVar.dbModule //`${process.argv[1].split("/").slice(0,-1).join("/")}/../${dbModule}`
    constructor() { }
    /**
     * run all .js file recursively, given a folder
     */
    recursiveSearch(path, extension, options) {
        try {
            const dirents = fs_1.default.readdirSync(path, { withFileTypes: true });
            const fileNames = dirents
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name);
            const folderNames = dirents
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            let paths = [];
            for (let folderName of folderNames)
                paths = [...paths, ...this.recursiveSearch(path + "/" + folderName, extension, options)];
            for (let fileName of fileNames) {
                if (fileName.slice(-1 * (extension.length + 1)).toLowerCase() === "." + extension.toLowerCase()) {
                    if (options.runFiles)
                        require(path + "/" + fileName);
                    paths.push(path + "/" + fileName);
                }
            }
            return paths;
        }
        catch (e) {
            console.error(e);
            return [];
        }
    }
}
exports.FilesEngine = FilesEngine;
