"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDBVersion = void 0;
const fs_1 = __importDefault(require("fs"));
const exe_1 = __importDefault(require("../exe/exe"));
const install_1 = require("../../install");
const root = install_1.appModule;
function getCurrentDBVersion() {
    let rootDirs = fs_1.default.readdirSync(root, { withFileTypes: true });
    let dbDirExists = false;
    for (let dirName of getDirNames(rootDirs))
        if (dirName == "database")
            dbDirExists = true;
    if (!dbDirExists)
        exe_1.default("mkdir", ["-p", root + "/database"], true);
    const dbDirents = fs_1.default.readdirSync(root + "/database", { withFileTypes: true });
    for (let dirName of getDirNames(dbDirents))
        if (dirName.slice(0, 4) == "at.v")
            return Number(dirName.slice(4));
    return 0;
}
exports.getCurrentDBVersion = getCurrentDBVersion;
function getDirNames(dirents) {
    return dirents
        .filter(dirent => !dirent.isFile())
        .map(dirent => dirent.name);
}
