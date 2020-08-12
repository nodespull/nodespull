"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_Model_Rel_FilesLoader = void 0;
const fs_1 = __importDefault(require("fs"));
const common_1 = require("./common");
const connection_1 = require("../database/connection");
const log_1 = require("../etc/log");
const common_2 = require("../database/helpers/common");
const stage_attribute_1 = __importDefault(require("../cli/database/table/templates/stage.attribute"));
const stage_relation_1 = __importDefault(require("../cli/database/table/templates/stage.relation"));
const paths_1 = require("../etc/other/paths");
class DB_Model_Rel_FilesLoader extends common_1.FilesEngine {
    constructor(args) {
        super();
        this.args = args;
        this.tableNames_definitions_map = {}; // used to store the "at.vx" definitions and update "stage.vx" files
        this.tableNames_relations_map = {};
        this.dbPath = "";
        if (args.dbConnectionSelector && connection_1.DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRunning) {
            this.dbPath = args.dbConnectionSelector + "-db";
            let targetFolderPath;
            if (connection_1.DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRevertMode)
                targetFolderPath = this.getFolderPath(paths_1.PathVar.getDbModule() + "/" + this.dbPath, "stage.v"); // migration down scripts are in this folder
            else
                targetFolderPath = this.getFolderPath(paths_1.PathVar.getDbModule() + "/" + this.dbPath, "at.v"); // migration up are here
            if (!targetFolderPath)
                new log_1.Log(`missing folder with prefix '${connection_1.DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRevertMode ?
                    "stage.v" : "at.v"}' in '${paths_1.PathVar.getDbModule().split("/").slice(-2).join("/")}' directory tree`).throwError();
            else {
                super.recursiveSearch(targetFolderPath, "attribute.js", { runFiles: true });
                super.recursiveSearch(targetFolderPath, "relation.js", { runFiles: true });
            }
            if (args && connection_1.DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRunning && args.overwrite_newStageScripts)
                this.updateStageFiles();
        }
        else {
            const dbFolderPaths = fs_1.default.readdirSync(paths_1.PathVar.getDbModule() + "/" + this.dbPath, { withFileTypes: true })
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            for (let dbFolderPath of dbFolderPaths) {
                let targetFolderPath = this.getFolderPath(paths_1.PathVar.getDbModule() + "/" + this.dbPath + "/" + dbFolderPath, "at.v");
                if (!targetFolderPath)
                    throw new log_1.Log("missing folder with prefix 'at.v' in " + dbFolderPath).getValue();
                super.recursiveSearch(targetFolderPath, "attribute.js", { runFiles: true });
                super.recursiveSearch(targetFolderPath, "relation.js", { runFiles: true });
            }
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
        let modelPaths = super.recursiveSearch(paths_1.PathVar.getDbModule() + "/" + this.dbPath + "/stage.v" + (common_2.getCurrentDBVersion(this.args.dbConnectionSelector) + 1) + "/", "attribute.js", { runFiles: false });
        let relPaths = super.recursiveSearch(paths_1.PathVar.getDbModule() + "/" + this.dbPath + "/stage.v" + (common_2.getCurrentDBVersion(this.args.dbConnectionSelector) + 1) + "/", "relation.js", { runFiles: false });
        for (let path of modelPaths) {
            let tableName = path.split("/").splice(-1)[0].split(".")[0];
            let modelFile = fs_1.default.readFileSync(path, 'utf8');
            let tempReg = modelFile.match(/(    | )Database.defineModel\(([\s\S]*?)}\)/);
            let modelFile_extract = tempReg ? tempReg[0] : null;
            fs_1.default.writeFileSync(path, stage_attribute_1.default(modelFile_extract, this.args.dbConnectionSelector));
        }
        for (let path of relPaths) {
            let tableName = path.split("/").splice(-1)[0].split(".")[0];
            let modelFile = fs_1.default.readFileSync(path, 'utf8');
            let tempReg = modelFile.match(/(    | )Relations.set\(([\s\S]*?)}\)/);
            let modelFile_extract = tempReg ? tempReg[0] : null;
            fs_1.default.writeFileSync(path, stage_relation_1.default(modelFile_extract, this.args.dbConnectionSelector));
        }
    }
}
exports.DB_Model_Rel_FilesLoader = DB_Model_Rel_FilesLoader;
