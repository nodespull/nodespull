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
const paths_1 = require("../../etc/other/paths");
const module_template_1 = __importDefault(require("./templates/module.template"));
const root = paths_1.PathVar.appModule;
function newModule(moduleName) {
    return __awaiter(this, void 0, void 0, function* () {
        let moduleVarName = moduleName.toLowerCase();
        if (moduleName.slice(-1 * "Module".length) != "Module")
            moduleVarName = moduleVarName.toLowerCase() + "Module";
        let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".mod.js";
        let moduleDirName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + "-module";
        exe_log_1.cmd("mkdir", ["-p", root + "/" + moduleDirName]);
        exe_log_1.cmd("mkdir", ["-p", root + "/" + moduleDirName + "/services"]);
        exe_log_1.cmd("mkdir", ["-p", root + "/" + moduleDirName + "/services/self-boot"]);
        // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/services/socket"]);
        exe_log_1.cmd("mkdir", ["-p", root + "/" + moduleDirName + "/services/pipe-usable"]);
        exe_log_1.cmd("mkdir", ["-p", root + "/" + moduleDirName + "/services/generic"]);
        exe_log_1.cmd("mkdir", ["-p", root + "/" + moduleDirName + "/routes"]);
        // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/graphql"]);
        exe_log_1.cmd("touch", [root + "/" + moduleDirName + "/" + moduleFileName]); // create module file
        fs_1.default.writeFile(root + "/" + moduleDirName + "/" + moduleFileName, module_template_1.default(moduleVarName), () => { }); // populate module file with template
    });
}
exports.newModule = newModule;
