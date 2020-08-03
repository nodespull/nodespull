import {cmd} from "../exe/exe.log"
import fs from "fs"
import { appModule } from "../../install"
import {error} from "../cli"

import getDefaultTemplate from "./templates/service.template"
import getBootTemplate from "./templates/service.boot.template"
import getPipeTemplate from "./templates/service.pipe.template"
import getSocketTemplate from "./templates/service.socket.template"

const root = appModule;
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
    if(moduleVarName == "main.module" || !moduleVarName) moduleVarName = "mainModule"
    if(moduleVarName.toLowerCase().includes(".module")) moduleVarName = moduleVarName.toLowerCase().split(".")[0]+"Module"
    else if (moduleVarName != "mainModule") throw error.wrongUsage

    // create service file
    serviceVarName = serviceVarName.toLowerCase()// lint: lowercase service name
    // let servicePath = root+"/main-module/services"
    // if(moduleVarName != "mainModule") servicePath = root+"/"+moduleVarName+"/services"
    let servicePath = root+"/"+moduleVarName+"/services"
    cmd("touch",[servicePath])

    // populate service file with appropriate template
    if(option == "--boot" || option=="-b") fs.writeFile(servicePath+"/self-boot/"+serviceVarName+".service.js", getBootTemplate(serviceVarName, moduleVarName), ()=>{})
    if(option == "--pipe" || option=="-p") fs.writeFile(servicePath+"/pipe-usable/"+serviceVarName+".service.js", getPipeTemplate(serviceVarName, moduleVarName), ()=>{})
    if(option == "--socket" || option=="-s") fs.writeFile(servicePath+"/socket/"+serviceVarName+".service.js", getSocketTemplate(serviceVarName, moduleVarName), ()=>{})
    if(option == "--default") fs.writeFile(servicePath+"/generic/"+serviceVarName+".service.js", getDefaultTemplate(serviceVarName, moduleVarName), ()=>{})

    if(moduleVarName == "mainModule") cmd("mkdir", ["-p", root+"/main-module/services"]);

}
