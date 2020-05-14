import {cmd} from "../exe/exe.log"
import fs from "fs"

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

const root = "app.modules";

const templateList:  {[_:string]:{[_:string]:any}} = {
    delete: {delete: del, spec_del},
    get: {get, spec_get},
    post: {post, spec_post},
    put: {put, spec_put},
    head: {head,spec_head}
}


function getTemplate(template:Function, filePath:string, extCount:number):string{
    let fileNameParts = filePath.split("/").pop()!.split("."); // remove absolute part of path, split fileName parts
    fileNameParts = fileNameParts.slice(0, fileNameParts.length- (1+extCount)); //remove all from .get up
    let routePath = "";
    while(fileNameParts.length > 0){
        routePath += "/"+fileNameParts.shift(); //reconstruct path without parent dir and .get.ext
    }
    return template(routePath); // load template with routePath
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
                let extCount = 1;
                if(templateKey.startsWith("spec")){
                    templFilePath += ".spec.js";
                    extCount  = 2;
                }
                else templFilePath += ".js";
                cmd("touch",[root+"/"+templFilePath]);
                fs.writeFile(root+"/"+templFilePath,getTemplate(templateList[templGroupKey][templateKey], templFilePath,extCount),()=>{})
            }
        }
    }, 2000);
}
