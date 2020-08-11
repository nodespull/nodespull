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
exports.newTable = void 0;
const exe_1 = __importDefault(require("../../exe/exe"));
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../../../etc/other/paths");
const attribute_1 = __importDefault(require("./templates/attribute"));
const relation_1 = __importDefault(require("./templates/relation"));
const common_1 = require("../../../database/helpers/common");
const connection_1 = require("../../../database/connection");
const __1 = require("../..");
const templates = { attribute: attribute_1.default, relation: relation_1.default };
function getTemplate(template, tableName, dbConnectionSelector) {
    return templates[template](tableName, dbConnectionSelector);
}
function newTable(arg) {
    return __awaiter(this, void 0, void 0, function* () {
        let dbConnectionSelector = arg.split("/")[0];
        if (!["database", "db"].includes(dbConnectionSelector.split(".")[1]))
            throw __1.error.wrongUsage;
        else
            dbConnectionSelector = dbConnectionSelector.split(".")[0];
        let tableName = arg.split("/")[1];
        if (!tableName)
            throw __1.error.wrongUsage;
        connection_1.DatabaseConnectionController.throwIfNotRegistered(dbConnectionSelector);
        let currVersion = common_1.getCurrentDBVersion(dbConnectionSelector);
        yield exe_1.default("mkdir", ["-p", paths_1.PathVar.dbModule + `/${dbConnectionSelector}-db/stage.v${currVersion + 1}/` + tableName + ".model"], false);
        yield exe_1.default("mkdir", ["-p", paths_1.PathVar.dbModule + `/${dbConnectionSelector}-db/archives`], false);
        for (let template of Object.keys(templates)) {
            let path = paths_1.PathVar.dbModule + `/${dbConnectionSelector}-db/stage.v${currVersion + 1}/` + tableName + ".model/" + tableName + "." + template + ".js";
            yield exe_1.default("touch", [path]), false;
            yield fs_1.default.writeFile(path, getTemplate(template, tableName, dbConnectionSelector), () => { });
        }
    });
}
exports.newTable = newTable;
