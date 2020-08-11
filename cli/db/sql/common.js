"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDBVersion = void 0;
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../../../etc/other/paths");
function getCurrentDBVersion() {
    if (!fs_1.default.existsSync(paths_1.PathVar.dbModule + "/SQL"))
        return 0;
    const dbDirents = fs_1.default.readdirSync(paths_1.PathVar.dbModule + "/SQL", { withFileTypes: true });
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
