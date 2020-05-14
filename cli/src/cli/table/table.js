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
const exe_1 = __importDefault(require("../exe/exe"));
const fs_1 = __importDefault(require("fs"));
const model_1 = __importDefault(require("./templates/model"));
const relation_1 = __importDefault(require("./templates/relation"));
const templates = { model: model_1.default, relation: relation_1.default };
function getTemplate(template, tableName, pk) {
    if (pk)
        pk.type = pk.type.toLowerCase().startsWith("i") ? "int" : "string";
    return templates[template](tableName, pk);
}
const root = "app.modules";
function newTable(tableName, _pk) {
    return __awaiter(this, void 0, void 0, function* () {
        let pk = undefined;
        if (_pk)
            pk = { attr: _pk.split(":")[0], type: _pk.split(":")[1] };
        yield exe_1.default("mkdir", ["-p", root + "/tables"], false);
        yield exe_1.default("mkdir", ["-p", root + "/tables/" + tableName], false);
        for (let template of Object.keys(templates)) {
            let path = root + "/tables/" + tableName + "/" + tableName + "." + template + ".js";
            yield exe_1.default("touch", [path]), false;
            yield fs_1.default.writeFile(path, getTemplate(template, tableName, pk), () => { });
        }
    });
}
exports.newTable = newTable;
