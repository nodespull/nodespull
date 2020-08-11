import {cmd} from "../exe/exe.log"
import fs from "fs"
import {PathVar} from "../../etc/other/paths"

import getModuleTemplate from "./templates/module.template"

const root = PathVar.appModule;

export async function newModule(moduleName:string){
    let moduleVarName = moduleName.toLowerCase()
    if(moduleName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module.js"
    let moduleDirName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+"-module"

    cmd("mkdir", ["-p", root+"/"+moduleDirName]);
    cmd("mkdir", ["-p", root+"/"+moduleDirName+"/services"]);
    cmd("mkdir", ["-p", root+"/"+moduleDirName+"/services/self-boot"]);
    // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/services/socket"]);
    cmd("mkdir", ["-p", root+"/"+moduleDirName+"/services/pipe-usable"]);
    cmd("mkdir", ["-p", root+"/"+moduleDirName+"/services/generic"]);
    cmd("mkdir", ["-p", root+"/"+moduleDirName+"/routes"]);
    // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/graphql"]);
    cmd("touch",[root+"/"+moduleDirName+"/"+moduleFileName]); // create module file
    fs.writeFile(root+"/"+moduleDirName+"/"+moduleFileName, getModuleTemplate(moduleVarName),()=>{}) // populate module file with template
}
