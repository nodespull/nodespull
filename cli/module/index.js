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
exports.newModule = void 0;
const exe_log_1 = require("../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const install_1 = require("../../install");
const module_template_1 = __importDefault(require("./templates/module.template"));
const root = install_1.appModule;
function newModule(moduleName) {
    return __awaiter(this, void 0, void 0, function* () {
        let moduleVarName = moduleName;
        if (moduleName.slice(-1 * "Module".length) != "Module")
            moduleVarName = moduleVarName.toLowerCase() + "Module";
        let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".module.js";
        exe_log_1.cmd("mkdir", ["-p", root + "/server/" + moduleVarName]);
        exe_log_1.cmd("mkdir", ["-p", root + "/server/" + moduleVarName + "/_services"]);
        exe_log_1.cmd("mkdir", ["-p", root + "/server/" + moduleVarName + "/_routes"]);
        exe_log_1.cmd("touch", [root + "/server/" + moduleVarName + "/" + moduleFileName]); // create module file
        fs_1.default.writeFile(root + "/server/" + moduleVarName + "/" + moduleFileName, module_template_1.default(moduleVarName), () => { }); // populate module file with template
    });
}
exports.newModule = newModule;
