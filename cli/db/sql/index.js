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
const model_1 = __importDefault(require("./templates/model"));
const relation_1 = __importDefault(require("./templates/relation"));
const common_1 = require("./common");
const templates = { model: model_1.default, relation: relation_1.default };
function getTemplate(template, tableName) {
    return templates[template](tableName);
}
function newTable(tableName) {
    return __awaiter(this, void 0, void 0, function* () {
        let currVersion = common_1.getCurrentDBVersion();
        yield exe_1.default("mkdir", ["-p", paths_1.PathVar.dbModule + `/SQL/stage.v${currVersion + 1}/` + tableName], false);
        yield exe_1.default("mkdir", ["-p", paths_1.PathVar.dbModule + `/SQL/archives`], false);
        for (let template of Object.keys(templates)) {
            let path = paths_1.PathVar.dbModule + `/SQL/stage.v${currVersion + 1}/` + tableName + "/" + tableName + "." + template + ".js";
            yield exe_1.default("touch", [path]), false;
            yield fs_1.default.writeFile(path, getTemplate(template, tableName), () => { });
        }
    });
}
exports.newTable = newTable;
