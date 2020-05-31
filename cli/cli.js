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
exports.getCmd = exports.start = void 0;
const stdin_1 = __importDefault(require("../etc/system-tools/stdin"));
const route_1 = require("./route/route");
const table_1 = require("./table/table");
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
                throw error.falseNameFormat;
            switch (args[1]) {
                case "route":
                    if (createCmd.includes(userCmd))
                        yield route_1.newRoute(name);
                    else
                        throw error.falseCmd;
                    console.log("\nRoute \"" + name + "\" successfully created");
                    break;
                case "table":
                    if (createCmd.includes(userCmd))
                        yield table_1.newTable(name, args[3]);
                    else
                        throw error.falseCmd;
                    console.log("\nTable \"" + name + "\" successfully created");
                    break;
                default:
                    throw error.falseCmd;
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
    create table <name>         : generate files for a new database table <name> !no quotes!
    create route <path/path>    : generate files for a new route at path <path/path> !no quotes!
    q | quit | exit             : exit nodespull cli
    h | help | info | ?         : view available commands`);
    main();
}
function exit() {
    console.log("Exiting CLI...");
}
const error = {
    falseCmd: "ERR: Command not recognized. Enter `help` for info.",
    falseNameFormat: "ERR: Name format incorrect."
};
