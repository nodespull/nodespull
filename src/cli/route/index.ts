import {cmd} from "../exe/exe.log"
import fs from "fs"
import {PathVar} from "../../etc/other/paths"

import del from "./templates/delete/delete.template"
import get from "./templates/get/get.template"
import post from "./templates/post/post.template"
import put from "./templates/put/put.template"
import head from "./templates/head/head.template"

import spec_del from "./templates/delete/spec.delete.template"
import spec_get from "./templates/get/spec.get.template"
import spec_post from "./templates/post/spec.post.template"
import spec_put from "./templates/put/spec.put.template"
import spec_head from "./templates/head/spec.head.template"

import swag_del from "./templates/delete/swagger.delete.template"
import swag_get from "./templates/get/swagger.get.template"
import swag_post from "./templates/post/swagger.post.template"
import swag_put from "./templates/put/swagger.put.template"
import swag_head from "./templates/head/swagger.head.template"
import { npModuleController } from "../../module/controllers/npModuleController"
import { Log } from "../../etc/log"


let templateList:  {[_:string]:{[_:string]:any}} = {
    delete: {delete: del, spec_del, swag_del},
    get: {get, spec_get, swag_get},
    post: {post, spec_post, swag_post},
    put: {put, spec_put, swag_put},
    head: {head,spec_head, swag_head}
}

const rebuildTemplateList = ()=>templateList = {
    delete: {delete: del, spec_del, swag_del},
    get: {get, spec_get, swag_get},
    post: {post, spec_post, swag_post},
    put: {put, spec_put, swag_put},
    head: {head,spec_head, swag_head}
}


function getTemplate(moduleName:string, routeName:string,template:Function, filePath:string, extCount:number):string{
    let parts =  routeName.split("/")
    routeName = "/"+parts.slice(2,parts.length-2).join("/"); // remove '$moduleName/rest'
    routeName = routeName.replace("//","/")


    //remove dot in last part of deep paths
    parts = routeName.split("/");
    parts.shift(); // remove empty first e
    let depthCountFromModule = 2+parts.length //levels deep from module
    if(parts.length>1){
        let deepName:string = "/"+parts.shift()!;
        for(let part of parts){
            deepName += "/"+ part.split(".").pop();
        }
        routeName = deepName;
    }
    
    routeName = "/"+routeName.substring(2,routeName.length); // remove dir_underscore, e.g. /_name/path

    return template(routeName, moduleName, depthCountFromModule); // load template with routePath
}




export async function newRoute(name:string, methods:any|string[]){

    if(methods) for(let method of Object.keys(templateList)) 
        if(!methods.map((m:string)=>m.toLowerCase()).includes(method)) delete templateList[method]

    let args = name.split("/");
    let moduleVarName:string = "mainModule"
    if(args[0].toLowerCase().includes(".module") || args[0].toLowerCase().includes(".mod")){
        moduleVarName = args[0].toLowerCase().split(".")[0]+"Module"
        args = args.slice(1)
    }
    let fileName = "";
    let fileName_withUnderscore = "";
    let routeDirPath = "main-module/routes";
    if(moduleVarName != "mainModule"){
        let moduleDirName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+"-module"
        routeDirPath = moduleDirName+"/routes"
    }


    //check if module exists
    if(!npModuleController.registeredModules.map((mod => mod._name)).includes(moduleVarName))
        throw new Log(`module '${moduleVarName.substr(0, moduleVarName.length-1*"Module".length)}' not found`).FgRed().getValue()


    while(args.length > 0){
        let e = args.shift();
        fileName = fileName!=""?(fileName+"."+e):e!;
        fileName_withUnderscore = fileName_withUnderscore!=""?(fileName_withUnderscore+"."+e):"_"+e!;
        routeDirPath = routeDirPath+"/"+fileName_withUnderscore;
        await cmd("mkdir", ["-p", PathVar.getAppModule()+"/"+routeDirPath], true);
    }

    //check if a method-route already exists
    let mod = npModuleController.registeredModules.filter(m=>m._name == moduleVarName)[0]
    let requestedRoutesKeys = []
    for(let m of Object.keys(templateList))
        requestedRoutesKeys.push(m.toUpperCase()+":/"+fileName.split(".").join("/"))
    for(let rrk of requestedRoutesKeys)
        if(Object.keys(mod._route).includes(rrk))
            throw new Log(`route '${rrk.split(":")[0]}:${fileName.split(".").join("/")}' already exists`).FgRed().getValue()


    // setTimeout(() => {
        for(let templGroupKey of Object.keys(templateList)){
            let templDirPath:string = routeDirPath +"/"+fileName+"."+templGroupKey;
            cmd("mkdir", ["-p", PathVar.getAppModule()+"/"+ templDirPath], true);
            for(let templateKey of Object.keys(templateList[templGroupKey])){
                let templFilePath:string = templDirPath+"/"+(fileName+"."+templGroupKey);
                let extCount = 2;
                if(templateKey.startsWith("spec")){
                    templFilePath += ".spec.js";
                    extCount = 3;
                }
                else if(templateKey.startsWith("swag")){
                    templFilePath = templDirPath+"/swagger.json";
                    extCount = 1;
                }
                else templFilePath += ".js";
                cmd("touch",[PathVar.getAppModule()+"/"+templFilePath], true);
                await fs.writeFile(PathVar.getAppModule()+"/"+templFilePath,getTemplate(
                    moduleVarName,
                    templDirPath+"/"+fileName, //remove initial underscore
                    templateList[templGroupKey][templateKey], 
                    templFilePath,extCount),()=>{})
            }
        }
        rebuildTemplateList()
    // }, 2000);
}
