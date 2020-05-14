import {cmd} from "../exe/exe.log"
import fs from "fs"
import {appModule} from "../../install"

import del from "./templates/delete/delete"
import get from "./templates/get/get"
import post from "./templates/post/post"
import put from "./templates/put/put"
import head from "./templates/head/head"

import spec_del from "./templates/delete/spec.delete"
import spec_get from "./templates/get/spec.get"
import spec_post from "./templates/post/spec.post"
import spec_put from "./templates/put/spec.put"
import spec_head from "./templates/head/spec.head"

import swag_del from "./templates/delete/swagger.delete"
import swag_get from "./templates/get/swagger.get"
import swag_post from "./templates/post/swagger.post"
import swag_put from "./templates/put/swagger.put"
import swag_head from "./templates/head/swagger.head"

const root = appModule;

const templateList:  {[_:string]:{[_:string]:any}} = {
    delete: {delete: del, spec_del, swag_del},
    get: {get, spec_get, swag_get},
    post: {post, spec_post, swag_post},
    put: {put, spec_put, swag_put},
    head: {head,spec_head, swag_head}
}


function getTemplate(routeName:string,template:Function, filePath:string, extCount:number):string{
    // let fileNameParts = filePath.split("/").pop()!.split("."); // take last part of path, split fileName parts
    // fileNameParts = fileNameParts.slice(0, fileNameParts.length- (extCount)); //remove all from .get up
    // let routePath = "";
    // while(fileNameParts.length > 0){
    //     routePath += "/"+fileNameParts.shift(); //reconstruct path without parent dir and .get.ext
    // }
    //build path
    let parts =  routeName.split("/")
    routeName = "/"+parts.slice(1,parts.length-2).join("/");
    routeName = routeName.replace("//","/")

    //remove dot in last part of deep paths
    parts = routeName.split("/");
    parts.shift(); // remove empty first e
    if(parts.length>1){
        let deepName:string = "/"+parts.shift()!;
        for(let part of parts){
            deepName += "/"+ part.split(".").pop();
        }
        routeName = deepName;
    }
    
    return template(routeName); // load template with routePath
}




export async function newRoute(name:string){
    let args = name.split("/");
    let fileName = "";
    let routeDirPath = "routes";
    while(args.length > 0){
        let e = args.shift();
        fileName = fileName!=""?(fileName+"."+e):e!;
        routeDirPath = routeDirPath+"/"+fileName;
        await cmd("mkdir", ["-p", root+"/"+routeDirPath], false);
    }
    setTimeout(() => {
        for(let templGroupKey of Object.keys(templateList)){
            let templDirPath:string = routeDirPath +"/"+fileName+"."+templGroupKey;
            cmd("mkdir", ["-p", root+"/"+ templDirPath]);
            for(let templateKey of Object.keys(templateList[templGroupKey])){
                let templFilePath:string = templDirPath+"/"+(fileName+"."+templGroupKey);
                let extCount = 2;
                if(templateKey.startsWith("spec")){
                    templFilePath += ".spec.js";
                    extCount  = 3;
                }
                else if(templateKey.startsWith("swag")){
                    templFilePath = templDirPath+"/swagger.json";
                    extCount = 1;
                }
                else templFilePath += ".js";
                cmd("touch",[root+"/"+templFilePath]);
                fs.writeFile(root+"/"+templFilePath,getTemplate(templDirPath+"/"+fileName,templateList[templGroupKey][templateKey], templFilePath,extCount),()=>{})
            }
        }
    }, 2000);
}
