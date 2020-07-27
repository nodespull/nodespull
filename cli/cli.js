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
exports.error = exports.getCmd = exports.start = void 0;
const stdin_1 = __importDefault(require("../etc/system-tools/stdin"));
const route_1 = require("./route");
const db_1 = require("./db");
const module_1 = require("./module");
const service_1 = require("./service");
function start() {
    console.log("\n*** Nodespull CLI ***  \n(`help` for info)");
    main();
}
exports.start = start;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let input = yield stdin_1.default("\n>> ");
        getCmd(input, true);
    });
}
function getCmd(input, loop) {
    return __awaiter(this, void 0, void 0, function* () {
        let createCmd = ["create", "c"];
        try {
            let args = input.split(" ");
            let userCmd = args[0];
            if (["help", "h", "info", "?"].includes(userCmd))
                return help();
            if (["q", "quit", "exit"].includes(userCmd))
                return exit();
            if (userCmd.trim() == "")
                return !loop ? null : main();
            let name = args[2] ? args[2].toLowerCase() : undefined;
            if (!name || name.includes("\"") || name.includes("'") || name.includes("`"))
                throw exports.error.falseNameFormat;
            switch (args[1]) {
                case "module":
                    if (createCmd.includes(userCmd))
                        yield module_1.newModule(name);
                    else
                        throw exports.error.falseCmd;
                    console.log("\nModule \"" + name + "\" successfully created");
                    break;
                case "route":
                    if (createCmd.includes(userCmd))
                        yield route_1.newRoute(name);
                    else
                        throw exports.error.falseCmd;
                    console.log("\nRoute \"" + name + "\" successfully created");
                    break;
                case "service":
                    if (createCmd.includes(userCmd))
                        yield service_1.newService(args.slice(2));
                    else
                        throw exports.error.falseCmd;
                    console.log("\nService \"" + name + "\" successfully created");
                    break;
                case "table":
                    if (createCmd.includes(userCmd))
                        yield db_1.newTable(name);
                    else
                        throw exports.error.falseCmd;
                    console.log("\nTable \"" + name + "\" successfully created");
                    break;
                default:
                    throw exports.error.falseCmd;
            }
            if (loop)
                main();
        }
        catch (e) {
            console.log(e);
            if (loop)
                main();
        }
    });
}
exports.getCmd = getCmd;
function help() {
    console.log(`
commands:
    Create
    Use the 'create' or 'c' command as follow:
        create module  <name>       : generate module
        create table   <name>       : generate database table/model
        create service <name>       : generate service
        create route   <path/path>  : generate route at path <path/path>

    To target modules, add the module name before the name of the element as follow:
    - i.e. create <entity> <moduleName>.module/<entityName>
    - e.g. create service shared.module/myservice 

    Service
    The 'service' entity uses the flags:
        --boot | -b     : generate self-booting service
        --pipe | -p     : generate pipe-usable service
    e.g. create service -b core.module/socket

    
    q | quit | exit        : exit nodespull cli
    h | help | info | ?    : view available commands`);
    main();
}
function exit() {
    console.log("Exiting CLI...");
}
exports.error = {
    falseCmd: "ERR: Command not recognized. Enter `help` for info.",
    falseNameFormat: "ERR: Name format incorrect.",
    wrongUsage: "ERR: command usage incorrect"
};
