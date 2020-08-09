"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration = void 0;
const log_1 = require("../etc/log");
const controller_1 = __importDefault(require("./controller"));
const db_model_rel_files_1 = require("../files-runner/db-model-rel-files");
const common_1 = require("../cli/db/sql/common");
const exe_1 = __importDefault(require("../cli/exe/exe"));
const common_2 = require("../files-runner/common");
const server_1 = require("../server");
const paths_1 = require("../etc/other/paths");
class Migration extends common_2.FilesEngine {
    constructor(arg) {
        super();
        this.currDBVersion = common_1.getCurrentDBVersion();
        let action = arg.split(" ")[0];
        this.dbConnectionSelector = arg.split(" ")[1];
        if (action == "up")
            this.up();
        else if (action == "down")
            this.down();
        else if (action == "freeze")
            this.inplace();
        else
            new log_1.Log("migration command incorrect. use 'up', 'down', or 'update'").throwError();
    }
    inplace() {
        console.log(`start database update using schema 'at.v${this.currDBVersion + 1}' ..`);
        controller_1.default.connections[this.dbConnectionSelector].migration.isRunning = true; // pseudo migration
        new db_model_rel_files_1.DB_Model_Rel_FilesRunner({ dbConnectionSelector: this.dbConnectionSelector });
        controller_1.default.connections[this.dbConnectionSelector].ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            for (let query of controller_1.default.connections[this.dbConnectionSelector].migration.rawQueries)
                server_1.Database.interfaces[this.dbConnectionSelector].runRawQuery(query);
            new log_1.Log(`job ran for database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing migration job ..\n");
        });
    }
    up() {
        console.log(`start database migration toward schema 'stage.v${this.currDBVersion + 1}' ..`);
        controller_1.default.connections[this.dbConnectionSelector].migration.isRunning = true;
        this.update_FileStructure_onUp();
        new db_model_rel_files_1.DB_Model_Rel_FilesRunner({ dbConnectionSelector: this.dbConnectionSelector });
        controller_1.default.connections[this.dbConnectionSelector].ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            for (let query of controller_1.default.connections[this.dbConnectionSelector].migration.rawQueries)
                server_1.Database.interfaces[this.dbConnectionSelector].runRawQuery(query);
            new log_1.Log(`job ran for database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing migration job ..\n");
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
        console.log(`start database revert towards schema 'archives/last.v${this.currDBVersion - 1}' ..`);
        controller_1.default.connections[this.dbConnectionSelector].migration.isRunning = true;
        controller_1.default.connections[this.dbConnectionSelector].migration.isRevertMode = true;
        this.update_FileStructure_onDown();
        new db_model_rel_files_1.DB_Model_Rel_FilesRunner({ dbConnectionSelector: this.dbConnectionSelector });
        controller_1.default.connections[this.dbConnectionSelector].ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            for (let query of controller_1.default.connections[this.dbConnectionSelector].migration.rawQueries)
                server_1.Database.interfaces[this.dbConnectionSelector].runRawQuery(query);
            new log_1.Log(`job ran for database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing migration job ..\n");
        });
    }
    update_FileStructure_onUp() {
        if (this.currDBVersion >= 2)
            exe_1.default("mv", [
                paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/archives/last.v" + (this.currDBVersion - 1),
                paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/archives/v" + (this.currDBVersion - 1)
            ], true); // mv last.vx to vx
        if (this.currDBVersion >= 1)
            exe_1.default("mv", [
                paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/at.v" + (this.currDBVersion),
                paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/archives/last.v" + (this.currDBVersion)
            ], true); // mv at.vx to last.vx
        exe_1.default("cp", [
            "-r", paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/stage.v" + (this.currDBVersion + 1),
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/at.v" + (this.currDBVersion + 1)
        ], true); // cp stage.vx to at.vx
        exe_1.default("mv", [
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/stage.v" + (this.currDBVersion + 1),
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/stage.v" + (this.currDBVersion + 2)
        ], true); // mv stage.vx to stage.v(x+1)
        new db_model_rel_files_1.DB_Model_Rel_FilesRunner({ overwrite_newStageScripts: true, dbConnectionSelector: this.dbConnectionSelector });
    }
    update_FileStructure_onDown() {
        exe_1.default("rm", ["-rf", paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/stage.v" + (this.currDBVersion + 1)], true); // rm stage.vx
        exe_1.default("mv", [
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/at.v" + (this.currDBVersion),
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/stage.v" + (this.currDBVersion)
        ], true); // mv at.vx to stage.vx
        exe_1.default("mv", [
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/archives/last.v" + (this.currDBVersion - 1),
            paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/at.v" + (this.currDBVersion - 1)
        ], true); // mv last.vx to at.vx
        if (this.currDBVersion >= 3)
            exe_1.default("mv", [
                paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/archives/v" + (this.currDBVersion - 2),
                paths_1.PathVar.dbModule + "/" + this.dbConnectionSelector + "/archives/last.v" + (this.currDBVersion - 2)
            ], true); // mv vx to last.vx
    }
}
exports.Migration = Migration;
