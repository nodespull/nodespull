"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_FilesRunner = void 0;
const fs_1 = __importDefault(require("fs"));
const common_1 = require("./common");
const controller_1 = __importDefault(require("../database/controller"));
const log_1 = require("../etc/log");
class DB_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        if (controller_1.default.migration.isRunning) {
            let targetFolderPath;
            if (controller_1.default.migration.isRevertMode)
                targetFolderPath = this.getFolderPath(common_1.FilesEngine.rootPath, "stage.v"); // migration down scripts are in this folder
            else
                targetFolderPath = this.getFolderPath(common_1.FilesEngine.rootPath, "at.v"); // migration up are here
            if (!targetFolderPath)
                new log_1.Log(`missing folder with prefix '${controller_1.default.migration.isRevertMode ? "stage.v" : "at.v"}' in '${common_1.FilesEngine.rootPath.split("/").slice(-2)[0]}' directory tree`).throwError();
            else {
                super.recursiveSearch(targetFolderPath, "model.js", { runFiles: true });
                super.recursiveSearch(targetFolderPath, "relation.js", { runFiles: true });
            }
        }
        else {
            super.recursiveSearch(common_1.FilesEngine.rootPath, "model.js", { runFiles: true });
            super.recursiveSearch(common_1.FilesEngine.rootPath, "relation.js", { runFiles: true });
        }
    }
    /**
     * search for path to at.vX or stage.vX directory and return it for recursiveRun
     */
    getFolderPath(path, folderNamePrefix) {
        try {
            if (path.split("/").pop() && path.split("/").pop().startsWith(folderNamePrefix))
                return path;
            const dirents = fs_1.default.readdirSync(path, { withFileTypes: true });
            const folderNames = dirents
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            let res;
            for (let folderName of folderNames)
                res = res || this.getFolderPath(path + "/" + folderName, folderNamePrefix);
            return res;
        }
        catch (_a) {
            return;
        }
    }
}
exports.DB_FilesRunner = DB_FilesRunner;
