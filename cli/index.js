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
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.getCmd = exports.start = void 0;
const stdin_1 = require("../etc/system-tools/stdin");
const route_1 = require("./route");
const db_1 = require("./database/db");
const table_1 = require("./database/table");
const module_1 = require("./module");
const service_1 = require("./service");
const log_1 = require("../etc/log");
const stdin_2 = require("../etc/system-tools/stdin");
const auth_1 = require("./auth");
let stdinInterface;
function start() {
    new log_1.Log(`\n*** Nodespull Interactive Mode ***  \n(enter 'help' for info)`).printValue();
    main();
}
exports.start = start;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        stdinInterface = stdin_1.userInput("\n>> ");
        let input = yield stdinInterface.getPromise();
        getCmd(input, true);
    });
}
function getCmd(input, loop) {
    return __awaiter(this, void 0, void 0, function* () {
        if (input != stdin_2.cliStack[stdin_2.cliStack.length - 1] && input.length > 0)
            stdin_2.cliStack.push(input);
        if (input == "clear") {
            stdinInterface.interface.removeAllListeners();
            stdinInterface.interface.close();
            process.stdout.write('\x1b[2J');
            process.stdout.moveCursor(0, -1 * process.stdout.rows);
            new log_1.Log(`\n*** Nodespull Interactive ***  \n(enter 'help' for info)`).printValue();
            return main();
        }
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
                    new log_1.Log("\nModudle \"" + name + "\" successfully created").FgGreen().printValue();
                    break;
                case "route":
                    if (createCmd.includes(userCmd))
                        yield route_1.newRoute(name);
                    else
                        throw exports.error.falseCmd;
                    new log_1.Log("\nRoute \"" + name + "\" successfully created").FgGreen().printValue();
                    break;
                case "service":
                    if (createCmd.includes(userCmd))
                        yield service_1.newService(args.slice(2));
                    else
                        throw exports.error.falseCmd;
                    new log_1.Log("\nService \"" + args[3] + "\" successfully created").FgGreen().printValue();
                    break;
                case "profile":
                    if (createCmd.includes(userCmd))
                        yield auth_1.newAuthProfile(args.slice(2));
                    else
                        throw exports.error.falseCmd;
                    new log_1.Log("\nAuth Profile \"" + args[3] + "\" successfully created").FgGreen().printValue();
                    break;
                case "database":
                    if (createCmd.includes(userCmd))
                        yield db_1.newDatabase(name);
                    else
                        throw exports.error.falseCmd;
                    new log_1.Log("\nDatabase \"" + name + "\" successfully created").FgGreen().printValue();
                    break;
                case "table":
                    if (createCmd.includes(userCmd))
                        yield table_1.newTable(args[2]);
                    else
                        throw exports.error.falseCmd;
                    new log_1.Log("\nTable \"" + name + "\" successfully created").FgGreen().printValue();
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
        create module   <name>                   : generate module
        create database <name>                   : generate route at path <path/path>
        create table    <selector.database/name> : generate table/model for specified db
        create service  <name>                   : generate service
        create profile  <name>                   : generate auth profile
        create route    <path/path>              : generate route at path <path/path>

    To target modules, add the module name before the name of the element as follow:
    - i.e. create <entity> <moduleName>.module/<entityName>
    - e.g. create service shared.module/myservice 

    Service
    The 'service' entity uses the flags:
        --boot | -b     : generate self-booting service
        --pipe | -p     : generate pipe-usable service
    e.g. create service -b core.module/socket

    Auth Profile
    The 'profile' entity uses the flags:
        --jwt           : generate jwt auth profile
        --oauth2 |      : generate oauth2 auth profile
    e.g. create profile --jwt main

    
    q | quit | exit        : exit nodespull cli
    h | help | info | ?    : view available commands`);
    main();
}
function exit() {
    new log_1.Log("Exiting Interactive mode...").FgBlue().printValue();
}
exports.error = {
    falseCmd: new log_1.Log("ERR: Command not recognized. Enter `help` for info").FgRed().getValue(),
    falseNameFormat: new log_1.Log("ERR: Name format incorrect").FgRed().getValue(),
    wrongUsage: new log_1.Log("ERR: command usage incorrect").FgRed().getValue()
};
