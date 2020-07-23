"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration = void 0;
const log_1 = require("../etc/log");
const controller_1 = __importDefault(require("./controller"));
const db_files_1 = require("../files-runner/db-files");
const common_1 = require("../cli/db/common");
const install_1 = require("../install");
const exe_1 = __importDefault(require("../cli/exe/exe"));
const common_2 = require("../files-runner/common");
const server_1 = require("../server");
const root = install_1.appModule;
class Migration extends common_2.FilesEngine {
    constructor(arg) {
        super();
        this.currDBVersion = common_1.getCurrentDBVersion();
        if (arg == "up")
            this.up();
        else if (arg == "down")
            this.down();
        else
            new log_1.Log("migration command incorrect. use 'up' or 'down'").throwError();
    }
    up() {
        console.log(`start database migration toward schema at 'stage.v${this.currDBVersion + 1}' ..`);
        controller_1.default.migration.isRunning = true;
        this.update_FileStructure_onUp();
        new db_files_1.DB_FilesRunner();
        controller_1.default.ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            for (let query of controller_1.default.migration.rawQueries)
                server_1.Database.runRawQuery(query);
            new log_1.Log(`job ran for database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing connection ..\n");
        });
    }
    down() {
        if (this.currDBVersion == 0) {
            new log_1.Log("No previous database version found").throwWarn();
            process.exit(1);
        }
        if (this.currDBVersion == 1) {
            new log_1.Log("database already at initial version").throwWarn();
            process.exit(1);
        }
        console.log(`start database revert towards schema at 'archives/last.v${this.currDBVersion - 1}' ..`);
        controller_1.default.migration.isRunning = true;
        controller_1.default.migration.isRevertMode = true;
        this.update_FileStructure_onDown();
        new db_files_1.DB_FilesRunner();
        controller_1.default.ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            for (let query of controller_1.default.migration.rawQueries)
                server_1.Database.runRawQuery(query);
            new log_1.Log(`job ran for database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing connection ..\n");
        });
    }
    update_FileStructure_onUp() {
        if (this.currDBVersion > 1)
            exe_1.default("mv", [root + "/database/archives/last.v" + (this.currDBVersion - 1), root + "/database/archives/v" + (this.currDBVersion - 1)], true); // mv last.vx to vx
        if (this.currDBVersion > 0)
            exe_1.default("mv", [root + "/database/at.v" + (this.currDBVersion), root + "/database/archives/last.v" + (this.currDBVersion)], true); // mv at.vx to last.vx
        exe_1.default("cp", ["-r", root + "/database/stage.v" + (this.currDBVersion + 1), root + "/database/at.v" + (this.currDBVersion + 1)], true); // cp stage.vx to at.vx
        exe_1.default("mv", [root + "/database/stage.v" + (this.currDBVersion + 1), root + "/database/stage.v" + (this.currDBVersion + 2)], true); // mv stage.vx to stage.vx+1
        // empty the files contents in stage.v
        // setTimeout(()=>{
        //     let stageModelPaths = this.recursiveSearch(FilesEngine.rootPath+"/database/stage.v"+(this.currDBVersion+2), "model.js", {runFiles:false})
        //     let stageRelationsPaths = this.recursiveSearch(FilesEngine.rootPath+"/database/stage.v"+(this.currDBVersion+2), "relation.js", {runFiles:false})
        //     for(let filePath of stageModelPaths) fs.writeFileSync(filePath,stageModelTemplate(),{encoding:'utf8',flag:'w'})
        //     for(let filePath of stageRelationsPaths) fs.writeFileSync(filePath,stageRelationTemplate(),{encoding:'utf8',flag:'w'})
        // },2000)
    }
    update_FileStructure_onDown() {
        exe_1.default("rm", ["-rf", root + "/database/stage.v" + (this.currDBVersion + 1)], true); // rm stage.vx
        exe_1.default("mv", [root + "/database/at.v" + (this.currDBVersion), root + "/database/stage.v" + (this.currDBVersion)], true); // mv at.vx to stage.vx
        exe_1.default("mv", [root + "/database/archives/last.v" + (this.currDBVersion - 1), root + "/database/at.v" + (this.currDBVersion - 1)], true); // mv last.vx to at.vx
        if (this.currDBVersion > 2)
            exe_1.default("mv", [root + "/database/archives/v" + (this.currDBVersion - 2), root + "/database/archives/last.v" + (this.currDBVersion - 2)], true); // mv vx to last.vx
    }
}
exports.Migration = Migration;
