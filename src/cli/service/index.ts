import {cmd} from "../exe/exe.log"
import fs from "fs"
import {appModule} from "../../install"
import {error} from "../cli"

import getDefaultTemplate from "./templates/service.template"
import getBootTemplate from "./templates/service.boot.template"
import getPipeTemplate from "./templates/service.pipe.template"


const root = appModule;
const validOptions:string[] = ["--boot","-b", "--pipe","-p", "--default"]

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
    if(moduleVarName == "server.module" || !moduleVarName) moduleVarName = "serverModule"
    if(moduleVarName.toLowerCase().includes(".module")) moduleVarName = moduleVarName.toLowerCase().split(".")[0]+"Module"
    else if (moduleVarName != "serverModule") throw error.wrongUsage

    // create service file
    serviceVarName = serviceVarName.toLowerCase()// lint: lowercase service name
    let servicePath = root+"/server/_services/"+serviceVarName+".service.js"
    if(moduleVarName != "serverModule") servicePath = root+"/server/"+moduleVarName+"/_services/"+serviceVarName+".service.js"
    cmd("touch",[servicePath])

    // populate service file with appropriate template
    if(option == "--boot" || option=="-b") fs.writeFile(servicePath, getBootTemplate(serviceVarName, moduleVarName), ()=>{})
    if(option == "--pipe" || option=="-p") fs.writeFile(servicePath, getPipeTemplate(serviceVarName, moduleVarName), ()=>{})
    if(option == "--default") fs.writeFile(servicePath, getDefaultTemplate(serviceVarName, moduleVarName), ()=>{})

    if(moduleVarName == "serverModule") cmd("mkdir", ["-p", root+"/server/_services"]);

}
