import {cmd} from "../exe/exe.log"
import fs from "fs"
import {appModule} from "../../install"

import getModuleTemplate from "./templates/module.template"

const root = appModule;

export async function newModule(moduleName:string){
    let moduleVarName = moduleName.toLowerCase()
    if(moduleName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module.js"
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/services"]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/services/self-boot"]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/services/socket"]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/services/pipe-usable"]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/services/generic"]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/rest"]);
    cmd("mkdir", ["-p", root+"/main-module/"+moduleVarName+"/graphql"]);
    cmd("touch",[root+"/main-module/"+moduleVarName+"/"+moduleFileName]); // create module file
    fs.writeFile(root+"/main-module/"+moduleVarName+"/"+moduleFileName, getModuleTemplate(moduleVarName),()=>{}) // populate module file with template
}
