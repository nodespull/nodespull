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
exports.install = exports.appModule = exports.rootFile_name = exports.sys_dir = void 0;
const execa = require('execa');
const fs = require("fs");
const stdin_1 = __importDefault(require("./etc/system-tools/stdin"));
const server_1 = require("./server");
// files list
const dockerfile_1 = __importDefault(require("./etc/developer-op-files/dockerfile"));
const docker_compose_all_1 = __importDefault(require("./etc/developer-op-files/docker-compose-all"));
const docker_compose_db_1 = __importDefault(require("./etc/developer-op-files/docker-compose-db"));
const nodespull_README_1 = __importDefault(require("./etc/developer-op-files/nodespull-README"));
const wait_for_it_1 = __importDefault(require("./etc/developer-op-files/wait-for-it"));
exports.sys_dir = "nodespull";
exports.rootFile_name = "nodespullApp";
exports.appModule = "app.module";
function install(rootFileName, serverPort, pull_all, setupDb, dbTools, dbConstroller) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.rootFile_name = rootFileName;
        console.log("\n** nodespull setup **\n");
        yield install_core();
        if (pull_all)
            yield install_others(serverPort);
        console.log("\n.. 100% - complete.\n");
        yield run("readme", "open", ["-a", "TextEdit", "nodespull-README.md"], (ok, data) => { });
        setupDb(dbConstroller);
    });
}
exports.install = install;
function install_core() {
    return __awaiter(this, void 0, void 0, function* () {
        yield run("mkdir sys", "mkdir", ["-p", exports.sys_dir], (ok, data) => { });
        yield run("npm MySQL2", "sudo", ["npm", "i", "mysql2"], (ok, data) => { });
    });
}
function install_others(serverPort) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbPort = 3333;
        let dbPortTest = server_1.DB_PORT_TEST;
        let dbConsoleport = 8889;
        let serverWaitTime_forDB = 300; //sec
        // serverPort = parseInt(await stdin(". Specify Local Port from which to launch node.js (Enter to skip): > ")) || serverPort;
        dbConsoleport = parseInt(yield stdin_1.default(". Port for nodespull local Database Portal (Enter to skip): > ")) || dbConsoleport;
        //dbPort = parseInt(await stdin(". Port for the nodespull local SQL Database  (Enter to skip): > ")) || dbPort;
        yield run("nodespull-README", "touch", ['nodespull-README.md'], (ok, data) => {
            if (ok)
                fs.writeFile("nodespull-README.md", nodespull_README_1.default(data), (err) => { });
            else
                console.log("Error: nodespull-README");
        }, { serverPort, dbConsoleport, rootFile_name: exports.rootFile_name });
        yield run("Dockerfile", "touch", [exports.sys_dir + '/Dockerfile'], (ok, data) => {
            if (ok)
                fs.writeFile(exports.sys_dir + "/Dockerfile", dockerfile_1.default(data), (err) => { });
            else
                console.log("Error: Dockerfile");
        }, { serverPort, rootFile_name: exports.rootFile_name });
        yield run("docker-compose-all", "touch", [exports.sys_dir + '/docker-compose-all.yml'], (ok, data) => {
            if (ok)
                fs.writeFile(exports.sys_dir + "/docker-compose-all.yml", docker_compose_all_1.default(data), (err) => { });
            else
                console.log("Error: docker-compose-all.yml");
        }, { serverPort, dbPort, dbConsoleport, rootFile_name: exports.rootFile_name, serverWaitTime_forDB, sys_dir: exports.sys_dir, dbPortTest });
        yield run("docker-compose-db", "touch", [exports.sys_dir + '/docker-compose-db.yml'], (ok, data) => {
            if (ok)
                fs.writeFile(exports.sys_dir + "/docker-compose-db.yml", docker_compose_db_1.default(data), (err) => { });
            else
                console.log("Error: docker-compose-db.yml");
        }, { serverPort, dbPort, dbConsoleport, rootFile_name: exports.rootFile_name, serverWaitTime_forDB, sys_dir: exports.sys_dir, dbPortTest });
        yield run("wait-for-it", "touch", [exports.sys_dir + "/wait-for-it.sh"], (ok, data) => {
            if (ok) {
                fs.writeFile(exports.sys_dir + "/wait-for-it.sh", wait_for_it_1.default(), (err) => { });
            }
        });
        yield run("wait-for-it chmod write", "sudo", ["chmod", "+x", "./" + exports.sys_dir + "/wait-for-it.sh"], (ok, data) => { });
        yield run("npm", "install", ["-g", "nodemon"], (ok, data) => { });
        yield run("npm", "install", ["-g", "heroku"], (ok, data) => { });
    });
}
function run(name, cmd, options, callback, data) {
    return __awaiter(this, void 0, void 0, function* () {
        //if(cmd=="touch" && fs.existsSync("./"+options[0])) return callback?callback(true,data):null;
        if (cmd == "sudo")
            console.log("\n. \"" + name + "\" requires admin level permission");
        yield (() => __awaiter(this, void 0, void 0, function* () {
            try {
                const { stdout } = yield execa(cmd, options);
                console.log(stdout);
                console.log("- configured \"" + name + "\"");
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
