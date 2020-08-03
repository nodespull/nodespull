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
const service_socket_template_1 = __importDefault(require("./templates/service.socket.template"));
const root = install_1.appModule;
const validOptions = ["--boot", "-b", "--pipe", "-p", "--socket", "-s", "--default"];
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
        if (moduleVarName == "main.module" || !moduleVarName)
            moduleVarName = "mainModule";
        if (moduleVarName.toLowerCase().includes(".module"))
            moduleVarName = moduleVarName.toLowerCase().split(".")[0] + "Module";
        else if (moduleVarName != "mainModule")
            throw cli_1.error.wrongUsage;
        // create service file
        serviceVarName = serviceVarName.toLowerCase(); // lint: lowercase service name
        // let servicePath = root+"/main-module/services"
        // if(moduleVarName != "mainModule") servicePath = root+"/"+moduleVarName+"/services"
        let servicePath = root + "/" + moduleVarName + "/services";
        exe_log_1.cmd("touch", [servicePath]);
        // populate service file with appropriate template
        if (option == "--boot" || option == "-b")
            fs_1.default.writeFile(servicePath + "/self-boot/" + serviceVarName + ".service.js", service_boot_template_1.default(serviceVarName, moduleVarName), () => { });
        if (option == "--pipe" || option == "-p")
            fs_1.default.writeFile(servicePath + "/pipe-usable/" + serviceVarName + ".service.js", service_pipe_template_1.default(serviceVarName, moduleVarName), () => { });
        if (option == "--socket" || option == "-s")
            fs_1.default.writeFile(servicePath + "/socket/" + serviceVarName + ".service.js", service_socket_template_1.default(serviceVarName, moduleVarName), () => { });
        if (option == "--default")
            fs_1.default.writeFile(servicePath + "/generic/" + serviceVarName + ".service.js", service_template_1.default(serviceVarName, moduleVarName), () => { });
        if (moduleVarName == "mainModule")
            exe_log_1.cmd("mkdir", ["-p", root + "/main-module/services"]);
    });
}
exports.newService = newService;
