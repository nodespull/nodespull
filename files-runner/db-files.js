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
const common_2 = require("../cli/db/common");
const stage_model_1 = __importDefault(require("../cli/db/templates/stage.model"));
const stage_relation_1 = __importDefault(require("../cli/db/templates/stage.relation"));
class DB_FilesRunner extends common_1.FilesEngine {
    constructor(option) {
        super();
        this.tableNames_definitions_map = {}; // used to store the "at.vx" definitions and update "stage.vx" files
        this.tableNames_relations_map = {};
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
        if (controller_1.default.migration.isRunning && option && option.overwrite_newStageScripts)
            this.updateStageFiles();
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
    /**
     * update stage files with scripts from 'at.vx'
    */
    updateStageFiles() {
        let modelPaths = super.recursiveSearch(common_1.FilesEngine.rootPath + "/database/stage.v" + (common_2.getCurrentDBVersion() + 1) + "/", "model.js", { runFiles: false });
        let relPaths = super.recursiveSearch(common_1.FilesEngine.rootPath + "/database/stage.v" + (common_2.getCurrentDBVersion() + 1) + "/", "relation.js", { runFiles: false });
        for (let path of modelPaths) {
            let tableName = path.split("/").splice(-1)[0].split(".")[0];
            let modelFile = fs_1.default.readFileSync(path, 'utf8');
            let tempReg = modelFile.match(/(    | )Database.defineModel\(([\s\S]*?)}\)/);
            let modelFile_extract = tempReg ? tempReg[0] : null;
            fs_1.default.writeFileSync(path, stage_model_1.default(modelFile_extract));
        }
        for (let path of relPaths) {
            let tableName = path.split("/").splice(-1)[0].split(".")[0];
            let modelFile = fs_1.default.readFileSync(path, 'utf8');
            let tempReg = modelFile.match(/(    | )Relations.set\(([\s\S]*?)}\)/);
            let modelFile_extract = tempReg ? tempReg[0] : null;
            fs_1.default.writeFileSync(path, stage_relation_1.default(modelFile_extract));
        }
    }
}
exports.DB_FilesRunner = DB_FilesRunner;
