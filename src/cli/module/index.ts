import {cmd} from "../exe/exe.log"
import fs from "fs"
import {appModule} from "../../install"

import getModuleTemplate from "./templates/module.template"

const root = appModule;

export async function newModule(moduleName:string){
    let moduleVarName = moduleName.toLowerCase()
    if(moduleName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module.js"
    cmd("mkdir", ["-p", root+"/server/"+moduleVarName]);
    cmd("mkdir", ["-p", root+"/server/"+moduleVarName+"/_services"]);
    cmd("mkdir", ["-p", root+"/server/"+moduleVarName+"/_routes"]);
    cmd("touch",[root+"/server/"+moduleVarName+"/"+moduleFileName]); // create module file
    fs.writeFile(root+"/server/"+moduleVarName+"/"+moduleFileName, getModuleTemplate(moduleVarName),()=>{}) // populate module file with template
}
