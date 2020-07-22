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
const root = install_1.appModule;
class Migration {
    constructor(arg) {
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
        new db_files_1.DB_FilesRunner();
        controller_1.default.ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            else
                new log_1.Log(`migrated database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing connection ..\n");
            this.update_FileStructure_onUp();
        });
    }
    down() {
        if (this.currDBVersion == 0)
            return new log_1.Log("No previous database version found").throwWarn();
        if (this.currDBVersion == 1)
            return new log_1.Log("database already at initial version").throwWarn();
        console.log(`start database revert towards schema at 'last.v${this.currDBVersion - 1}' ..`);
        controller_1.default.migration.isRunning = true;
        controller_1.default.migration.isRevertMode = true;
        new db_files_1.DB_FilesRunner();
        controller_1.default.ORM.interface.sync({ alter: true }).then((res, err) => {
            if (err)
                return console.log(err);
            else
                new log_1.Log(`reverted database '${res.config.database}'`).FgGreen().printValue();
            console.log("closing connection ..\n");
            this.update_FileStructure_onDown();
        });
    }
    update_FileStructure_onUp() {
        if (this.currDBVersion > 1)
            exe_1.default("mv", [root + "/database/last.v" + (this.currDBVersion - 1), root + "/database/v" + (this.currDBVersion - 1)], true); // mv last.vx to vx
        if (this.currDBVersion > 0)
            exe_1.default("mv", [root + "/database/at.v" + (this.currDBVersion), root + "/database/last.v" + (this.currDBVersion)], true); // mv at.vx to last.vx
        exe_1.default("cp", ["-r", root + "/database/stage.v" + (this.currDBVersion + 1), root + "/database/at.v" + (this.currDBVersion + 1)], true); // cp stage.vx to at.vx
        exe_1.default("mv", [root + "/database/stage.v" + (this.currDBVersion + 1), root + "/database/stage.v" + (this.currDBVersion + 2)], true); // mv stage.vx to stage.vx+1
    }
    update_FileStructure_onDown() {
        exe_1.default("rm", ["-rf", root + "/database/stage.v" + (this.currDBVersion + 1)], true); // rm stage.vx
        exe_1.default("mv", [root + "/database/at.v" + (this.currDBVersion), root + "/database/stage.v" + (this.currDBVersion)], true); // mv at.vx to stage.vx
        exe_1.default("mv", [root + "/database/last.v" + (this.currDBVersion - 1), root + "/database/at.v" + (this.currDBVersion - 1)], true); // mv last.vx to at.vx
        if (this.currDBVersion > 2)
            exe_1.default("mv", [root + "/database/v" + (this.currDBVersion - 2), root + "/database/last.v" + (this.currDBVersion - 2)], true); // mv vx to last.vx
    }
}
exports.Migration = Migration;
