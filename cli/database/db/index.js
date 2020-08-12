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
exports.newDatabase = void 0;
const exe_log_1 = require("../../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../../../etc/other/paths");
const database_template_1 = __importDefault(require("./templates/database.template"));
const string_validator_1 = require("../../../etc/system-tools/string-validator");
const log_1 = require("../../../etc/log");
const root = paths_1.PathVar.getDbModule();
function newDatabase(dbSelector) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!string_validator_1.StringParser.isExtendedAlphaNum(dbSelector))
            throw new log_1.Log("ERR: expected alphanumeric for db selector").FgRed().getValue();
        exe_log_1.cmd("mkdir", ["-p", root + "/" + dbSelector + "-db"]);
        // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/graphql"]);
        exe_log_1.cmd("touch", [root + "/" + dbSelector + "-db/" + dbSelector + ".database.js"]); // create module file
        fs_1.default.writeFile(root + "/" + dbSelector + "-db/" + dbSelector + ".database.js", database_template_1.default(dbSelector), () => { }); // populate module file with template
    });
}
exports.newDatabase = newDatabase;
