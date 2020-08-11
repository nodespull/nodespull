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
const __1 = require("..");
const paths_1 = require("../../etc/other/paths");
const service_template_1 = __importDefault(require("./templates/service.template"));
const service_boot_template_1 = __importDefault(require("./templates/service.boot.template"));
const service_pipe_template_1 = __importDefault(require("./templates/service.pipe.template"));
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
            throw __1.error.wrongUsage;
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
            throw __1.error.wrongUsage;
        // create service file
        serviceVarName = serviceVarName.toLowerCase(); // lint: lowercase service name
        let moduleDirName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + "-module";
        // let servicePath = root+"/main-module/services"
        // if(moduleVarName != "mainModule") servicePath = root+"/"+moduleVarName+"/services"
        let servicePath = paths_1.PathVar.appModule + "/" + moduleDirName + "/services";
        // populate service file with appropriate template
        let serviceFileRef = "";
        switch (option) {
            case "--boot":
            case "-b": {
                serviceFileRef = servicePath + "/self-boot/" + serviceVarName + ".service.js";
                exe_log_1.cmd("touch", [serviceFileRef]);
                fs_1.default.writeFile(serviceFileRef, service_boot_template_1.default(serviceVarName, moduleVarName), () => { });
                break;
            }
            case "--pipe":
            case "-p": {
                serviceFileRef = servicePath + "/pipe-usable/" + serviceVarName + ".service.js";
                exe_log_1.cmd("touch", [serviceFileRef]);
                fs_1.default.writeFile(serviceFileRef, service_pipe_template_1.default(serviceVarName, moduleVarName), () => { });
                break;
            }
            // case "--socket":
            // case "-s": {
            //     serviceFileRef = servicePath+"/socket/"+serviceVarName+".service.js"
            //     cmd("touch",[serviceFileRef])
            //     fs.writeFile(serviceFileRef, getSocketTemplate(serviceVarName, moduleVarName), ()=>{})
            //     break
            // }
            default: {
                serviceFileRef = servicePath + "/generic/" + serviceVarName + ".service.js";
                exe_log_1.cmd("touch", [serviceFileRef]);
                fs_1.default.writeFile(serviceFileRef, service_template_1.default(serviceVarName, moduleVarName), () => { });
                break;
            }
        }
        if (moduleVarName == "mainModule")
            exe_log_1.cmd("mkdir", ["-p", paths_1.PathVar.appModule + "/main-module/services"]);
    });
}
exports.newService = newService;
