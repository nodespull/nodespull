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
exports.install = exports.project_name = exports.rootFile_name = void 0;
const execa = require('execa');
const fs = require("fs");
const server_1 = require("./server");
const cli_1 = require("./cli");
// files list
const dockerfile_1 = __importDefault(require("./etc/developer-op-files/dockerfile"));
const docker_compose_all_1 = __importDefault(require("./etc/developer-op-files/docker-compose-all"));
const docker_compose_db_1 = __importDefault(require("./etc/developer-op-files/docker-compose-db"));
const nodespull_README_1 = __importDefault(require("./etc/developer-op-files/nodespull-README"));
const wait_for_it_1 = __importDefault(require("./etc/developer-op-files/wait-for-it"));
const app_env_1 = __importDefault(require("./templates/app-env"));
const paths_1 = require("./etc/other/paths");
exports.rootFile_name = "server.js";
exports.project_name = "";
function install(projectName, serverPort, pull_all, setupDb, dbTools, dbConstroller) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.project_name = projectName;
        console.log("\n** nodespull setup **\n");
        yield install_core();
        if (pull_all)
            yield install_others(serverPort);
        console.log("\n.. 100% - complete.\n");
        // await run("readme", "open", ["-a", "TextEdit", "nodespull-README.md"],(ok:boolean,data?:any)=>{})
        setupDb(dbConstroller);
    });
}
exports.install = install;
function install_core() {
    return __awaiter(this, void 0, void 0, function* () {
        // installs for os (docker files) and np's npm dependencies
        yield run("mkdir sys", "mkdir", ["-p", paths_1.PathVar.etc_os_dir], (ok, data) => { });
        yield run("npm MySQL2", "sudo", ["npm", "i", "mysql2"], (ok, data) => { });
        //database
        yield run("create np database", "mkdir", ["-p", paths_1.PathVar.dbModule + "/SQL"], (ok, data) => { });
        yield run("database", "mkdir", ["-p", paths_1.PathVar.dbModule + "/noSQL"], (ok, data) => { });
        //app env
        yield run("create np appEnvir", "mkdir", ["-p", paths_1.PathVar.appEnvModule], (ok, data) => {
            run("app local env", "touch", [paths_1.PathVar.appEnvModule + "/app.local.env.js"], (ok, data) => {
                if (ok)
                    fs.writeFile(paths_1.PathVar.appEnvModule + "/app.local.env.js", app_env_1.default("local"), () => { });
            });
            run("app prod env", "touch", [paths_1.PathVar.appEnvModule + "/app.prod.env.js"], (ok, data) => {
                if (ok)
                    fs.writeFile(paths_1.PathVar.appEnvModule + "/app.prod.env.js", app_env_1.default("prod"), () => { });
            });
        });
        // main module
        yield run("create app files", "mkdir", ["-p", paths_1.PathVar.appModule], (ok, data) => { });
        cli_1.getCmd("c module main", false);
    });
}
function install_others(serverPort) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbPort = 3333;
        let dbPortTest = server_1.DB_PORT_TEST;
        let dbConsoleport = 8889;
        let serverWaitTime_forDB = 300; //sec
        // serverPort = parseInt(await userInput(". Specify Local Port from which to launch node.js (Enter to skip): > ")).promise || serverPort;
        // dbConsoleport = parseInt(await userInput(". Port for nodespull local Database Portal (Enter to skip): > ")).promise || dbConsoleport;
        //dbPort = parseInt(await userInput(". Port for the nodespull local SQL Database  (Enter to skip): > ")).promise || dbPort;
        yield run("README.md", "touch", ['./README.md'], (ok, data) => {
            if (ok)
                fs.writeFile("README.md", nodespull_README_1.default(data), (err) => { });
            else
                console.log("Error: README.md");
        }, { serverPort, dbConsoleport, rootFile_name: exports.rootFile_name });
        yield run("Dockerfile", "touch", [paths_1.PathVar.etc_os_dir + '/Dockerfile'], (ok, data) => {
            if (ok)
                fs.writeFile(paths_1.PathVar.etc_os_dir + "/Dockerfile", dockerfile_1.default(data), (err) => { });
            else
                console.log("Error: Dockerfile");
        }, { serverPort, rootFile_name: exports.rootFile_name });
        yield run("docker-compose-all", "touch", [paths_1.PathVar.etc_os_dir + '/docker-compose-all.yml'], (ok, data) => {
            if (ok)
                fs.writeFile(paths_1.PathVar.etc_os_dir + "/docker-compose-all.yml", docker_compose_all_1.default(data), (err) => { });
            else
                console.log("Error: docker-compose-all.yml");
        }, { serverPort, dbPort, dbConsoleport, rootFile_name: exports.rootFile_name, serverWaitTime_forDB, dbPortTest });
        yield run("docker-compose-db", "touch", [paths_1.PathVar.etc_os_dir + '/docker-compose-db.yml'], (ok, data) => {
            if (ok)
                fs.writeFile(paths_1.PathVar.etc_os_dir + "/docker-compose-db.yml", docker_compose_db_1.default(data), (err) => { });
            else
                console.log("Error: docker-compose-db.yml");
        }, { serverPort, dbPort, dbConsoleport, rootFile_name: exports.rootFile_name, serverWaitTime_forDB, dbPortTest });
        yield run("wait-for-it", "touch", [paths_1.PathVar.etc_os_dir + "/wait-for-it.sh"], (ok, data) => {
            if (ok) {
                fs.writeFile(paths_1.PathVar.etc_os_dir + "/wait-for-it.sh", wait_for_it_1.default(), (err) => { });
            }
        });
        yield run("wait-for-it chmod write", "sudo", ["chmod", "+x", paths_1.PathVar.etc_os_dir + "/wait-for-it.sh"], (ok, data) => { });
        // await run("npm","install",["-g","nodemon"], (ok:boolean, data?:any)=>{});
        // await run("npm","install",["-g","heroku"], (ok:boolean, data?:any)=>{});
        // await run("npm","install",["-g","sequelize-cli"], (ok:boolean, data?:any)=>{});
    });
}
function run(name, cmd, options, callback, data) {
    return __awaiter(this, void 0, void 0, function* () {
        //if(cmd=="touch" && fs.existsSync("./"+options[0])) return callback?callback(true,data):null;
        if (cmd == "sudo")
            console.log("\n. \"" + name + "\" uses admin level permission");
        yield (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout } = yield execa(cmd, options);
                //console.log(stdout);
                //console.log(". "+name);
                if (callback)
                    callback(true, data);
            }
            catch (error) {
                console.log("- failed to configure " + name + " with exitCode: " + error.exitCode);
                if (callback)
                    callback(false, data);
            }
        }))();
    });
}
