"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.herokuPush = exports.herokuCreateApp = exports.herokuLogin = void 0;
const exe_log_1 = require("../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const dockerfile_1 = require("../deploy/templates/dockerfile");
const json_1 = require("../../etc/system-tools/json");
const stdin_1 = __importDefault(require("../../etc/system-tools/stdin"));
const paths_1 = require("../../etc/other/paths");
let packageJson = json_1.parseJSON(paths_1.PathVar.packageJson);
const rootFile = process.argv[1]; //fs.readFileSync("./"+packageJson.main,"utf8");
//log into heroku
function herokuLogin() {
    return __awaiter(this, void 0, void 0, function* () {
        yield exe_log_1.cmd("heroku", ["login"], false);
        yield exe_log_1.cmd("heroku", ["container:login"], false);
    });
}
exports.herokuLogin = herokuLogin;
//create app
function herokuCreateApp() {
    let appName = packageJson.name + "-" + getRandNumber();
    exe_log_1.cmd("heroku", ["create", "-a", appName], false);
    //cmd("heroku", ["create", "-a", appName+"-db"], false);
    return appName;
}
exports.herokuCreateApp = herokuCreateApp;
//push
function herokuPush() {
    return __awaiter(this, void 0, void 0, function* () {
        let appName = "";
        exe_log_1.cmd("heroku", ["apps"]);
        stdin_1.default("Enter app name (press `enter` for new app): ").then((name) => {
            if (name && name != "")
                appName = name;
            else { // also upload mysql image to new app
                appName = herokuCreateApp();
                //uploadImage("./Dockerfile",heroku_db_dockerfile(),appName+"-db");
            }
            //add_dbSettings_toRootFile(appName);
            uploadImage("./Dockerfile", dockerfile_1.appDockerfile(), appName);
            //remove_dbSettings_fromRootFile();
        });
    });
}
exports.herokuPush = herokuPush;
function add_dbSettings_toRootFile(appName) {
    let config = `
        $.config.database({
            username: "root",
            passsord: "nodespull-db-password",
            host: "https://${appName}-db.herokuapp.com/",
            database: "nodespull-db-database",
            port: "3306"
        })
    `;
    let rootFileParts = rootFile.split("$.server.ready");
    if (rootFile.includes("db.config") || rootFile.includes("Database.config") || rootFile.includes("config.db"))
        return;
    fs_1.default.writeFileSync("./" + packageJson.main, rootFileParts[0] + config + "\n$.server.ready" + rootFileParts[1]);
}
function remove_dbSettings_fromRootFile() {
    fs_1.default.writeFileSync("./" + packageJson.main, rootFile, "utf8");
}
function uploadImage(path, dockerfile, appName) {
    fs_1.default.writeFileSync(path, dockerfile, "utf8");
    console.log("\n\nThis might take a while. Please take a drink and relax..\n\n");
    exe_log_1.cmd("heroku", ["container:push", "web", "-a", appName]);
    exe_log_1.cmd("heroku", ["container:release", "web", "-a", appName]);
    console.log("preparing url... (20s)");
    setTimeout(() => {
        exe_log_1.cmd("heroku", ["open", "-a", appName]);
        exe_log_1.cmd("rm", ["./", path]);
    }, 20000);
}
function getRandNumber(max, min) {
    max = max ? max : 1000;
    min = min ? min : 100;
    let rand = min + Math.round(Math.random() * (max - min));
    return rand;
}
