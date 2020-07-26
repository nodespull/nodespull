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
exports.newService = void 0;
const exe_log_1 = require("../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const install_1 = require("../../install");
const cli_1 = require("../cli");
const service_template_1 = __importDefault(require("./templates/service.template"));
const service_boot_template_1 = __importDefault(require("./templates/service.boot.template"));
const service_pipe_template_1 = __importDefault(require("./templates/service.pipe.template"));
const root = install_1.appModule;
const validOptions = ["--boot", "-b", "--pipe", "-p", "--default"];
function newService(args) {
    return __awaiter(this, void 0, void 0, function* () {
        //parse 'option $name'
        let option = args[0];
        let serviceName = args[1];
        if (!validOptions.includes(option)) {
            serviceName = args[0];
            option = "--default";
        }
        if (validOptions.includes(option) && !serviceName)
            throw cli_1.error.wrongUsage;
        //parse 'name.module/serviceName'
        let serviceParts = serviceName.split("/");
        let moduleVarName = serviceParts[0];
        let serviceVarName = serviceParts[1];
        if (!serviceVarName) {
            serviceVarName = serviceParts[0];
            moduleVarName = null;
        }
        if (moduleVarName == "server.module" || !moduleVarName)
            moduleVarName = "serverModule";
        if (moduleVarName.toLowerCase().includes(".module"))
            moduleVarName = moduleVarName.toLowerCase().split(".")[0] + "Module";
        else if (moduleVarName != "serverModule")
            throw cli_1.error.wrongUsage;
        // create service file
        serviceVarName = serviceVarName.toLowerCase(); // lint: lowercase service name
        let servicePath = root + "/server/_services/" + serviceVarName + ".service.js";
        if (moduleVarName != "serverModule")
            servicePath = root + "/server/" + moduleVarName + "/_services/" + serviceVarName + ".service.js";
        exe_log_1.cmd("touch", [servicePath]);
        // populate service file with appropriate template
        if (option == "--boot" || option == "-b")
            fs_1.default.writeFile(servicePath, service_boot_template_1.default(serviceVarName, moduleVarName), () => { });
        if (option == "--pipe" || option == "-p")
            fs_1.default.writeFile(servicePath, service_pipe_template_1.default(serviceVarName, moduleVarName), () => { });
        if (option == "--default")
            fs_1.default.writeFile(servicePath, service_template_1.default(serviceVarName, moduleVarName), () => { });
        if (moduleVarName == "serverModule")
            exe_log_1.cmd("mkdir", ["-p", root + "/server/_services"]);
    });
}
exports.newService = newService;
