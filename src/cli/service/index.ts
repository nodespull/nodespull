import {cmd} from "../exe/exe.log"
import fs from "fs"
import {error} from ".."
import {PathVar} from "../../etc/other/paths"

import getDefaultTemplate from "./templates/service.template"
import getBootTemplate from "./templates/service.boot.template"
import getPipeTemplate from "./templates/service.pipe.template"
import getSocketTemplate from "./templates/service.socket.template"

const validOptions:string[] = ["--boot","-b", "--pipe","-p", "--socket","-s", "--default"]

export async function newService(args:string[]){
    //parse 'option $name'
    let option = args[0]
    let serviceName = args[1]
    if(!validOptions.includes(option)){
        serviceName = args[0]
        option = "--default"
    }
    if(validOptions.includes(option) && !serviceName) throw error.wrongUsage;

    //parse 'name.module/serviceName'
    let serviceParts = serviceName.split("/");
    let moduleVarName:string|null = serviceParts[0]
    let serviceVarName:string = serviceParts[1]
    if(!serviceVarName){
        serviceVarName = serviceParts[0]
        moduleVarName = null
    }
    if( (moduleVarName && ["main.module", "main.mod"].includes(moduleVarName)) || !moduleVarName) moduleVarName = "mainModule"
    if(moduleVarName.toLowerCase().includes(".module")) moduleVarName = moduleVarName.toLowerCase().split(".")[0]+"Module"
    else if (moduleVarName != "mainModule") throw error.wrongUsage

    // create service file
    serviceVarName = serviceVarName.toLowerCase()// lint: lowercase service name
    let moduleDirName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+"-module"

    // let servicePath = root+"/main-module/services"
    // if(moduleVarName != "mainModule") servicePath = root+"/"+moduleVarName+"/services"
    let servicePath = PathVar.getAppModule()+"/"+moduleDirName+"/services"

    // populate service file with appropriate template
    let serviceFileRef = ""
    switch(option) {
        case "--boot":
        case "-b": {
            serviceFileRef = servicePath+"/self-boot/"+serviceVarName+".srv.js"
            cmd("touch",[serviceFileRef])
            fs.writeFile(serviceFileRef, getBootTemplate(serviceVarName, moduleVarName), ()=>{})
            break
        }
        case "--pipe":
        case "-p": {
            serviceFileRef = servicePath+"/pipe-usable/"+serviceVarName+".srv.js"
            cmd("touch",[serviceFileRef])
            fs.writeFile(serviceFileRef, getPipeTemplate(serviceVarName, moduleVarName), ()=>{})
            break
        }
        // case "--socket":
        // case "-s": {
        //     serviceFileRef = servicePath+"/socket/"+serviceVarName+".service.js"
        //     cmd("touch",[serviceFileRef])
        //     fs.writeFile(serviceFileRef, getSocketTemplate(serviceVarName, moduleVarName), ()=>{})
        //     break
        // }
        default:{
            serviceFileRef = servicePath+"/generic/"+serviceVarName+".srv.js"
            cmd("touch",[serviceFileRef])
            fs.writeFile(serviceFileRef, getDefaultTemplate(serviceVarName, moduleVarName), ()=>{})
            break
        }
    }

    if(moduleVarName == "mainModule") cmd("mkdir", ["-p", PathVar.getAppModule()+"/main-module/services"]);

}
