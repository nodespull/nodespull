
import swagger_defaultContent from "./default-content"
import {writeJSON, parseJSON} from "../etc/system-tools/json"
import {cmd} from "../cli/exe/exe.log"
import fs from "fs"
import {PathVar} from "../etc/other/paths"
import { npModuleController } from "../module/controllers/npModuleController"

const swaggerUi = require('swagger-ui-express');
const docsURL = "/swagger"

let mainSwagger:any = {};

export default function(app:any){
    if(!fs.existsSync(PathVar.getEtc_var_dir()+"/swagger.json")){
        cmd("mkdir", ["-p",PathVar.getEtc_var_dir()]);
        cmd("touch", [PathVar.getEtc_var_dir()+"/swagger.json"]);
        writeJSON(PathVar.getEtc_var_dir()+"/swagger.json", swagger_defaultContent());
    }
    try{
        let docs:any;
        docs = parseJSON(PathVar.getEtc_var_dir()+"/swagger.json");
        //build swager file
        recursiveBuild(PathVar.getAppModule());
        if(JSON.stringify(docs) != JSON.stringify({...swagger_defaultContent(), ...mainSwagger})){
            writeJSON(PathVar.getEtc_var_dir()+"/swagger.json", {...swagger_defaultContent(), ...mainSwagger});
        }
        //load swagger file
        docs = parseJSON(PathVar.getEtc_var_dir()+"/swagger.json");
        app.use(docsURL, function(req:any, res:any, next:any){
            docs.host = req.get('host');
            req["swaggerDoc"] = docs;
            next();
        }, swaggerUi.serve, swaggerUi.setup());
    }catch{
        console.log(`swagger file has invalid format. Please delete file at "${PathVar.getEtc_var_dir()}/swagger.json" and try again`)
    }
}


/**
 * run all .js file recursively, given a folder
 */
let pathNames:string[] = [];
function recursiveBuild(path: string){
    try{
        const dirents = fs.readdirSync(path, { withFileTypes: true });

        const fileNames:string[] = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
    
        const folderNames:string[] = dirents
            .filter(dirent => !dirent.isFile())
            .map(dirent => dirent.name);
        
        for(let folderName of folderNames) recursiveBuild(path+"/"+folderName);
        for(let fileName of fileNames) {
            if(fileName != "swagger.json") continue;
            let swaggerFile = parseJSON(path+"/"+fileName);
            let pathName = Object.keys(swaggerFile)[0];
            let method = swaggerFile[pathName][0]
            let [paramsStringified, paramsList, isRouteActive, hasJwt] = getRouteStatus(swaggerFile, pathName)
            if(!isRouteActive) continue
            let pathName_withParams = pathName+paramsStringified
            if(pathName_withParams != pathName) {
                swaggerFile[pathName_withParams] = swaggerFile[pathName]
                delete swaggerFile[pathName]
            }
            // if(pathName_withParams != pathName){
            //     swaggerFile[pathName] = "test"
            // }
            if(hasJwt) {
                swaggerFile[pathName_withParams][Object.keys(swaggerFile[pathName_withParams])[0]]["security"] = [ {"jwt":["admin"]} ]
                swaggerFile[pathName_withParams][Object.keys(swaggerFile[pathName_withParams])[0]]["parameters"].unshift({
                    "name":"Authorization",
                    "in":"header",
                    "required":true,
                    "description":"JWT token - Bearer",
                    "type":"string"
                })
            }
            if(paramsList != []) for(let param of paramsList as Array<string>) 
                swaggerFile[pathName_withParams][Object.keys(swaggerFile[pathName_withParams])[0]]["parameters"].push({
                    "name":param,
                    "in":"path",
                    "required":true,
                    "description":"no description",
                    "type":"string"
                })
            if(pathNames.includes(pathName_withParams)) {
                mainSwagger["paths"][pathName_withParams] = {...mainSwagger["paths"][pathName_withParams], ...swaggerFile[pathName_withParams]};
            }
            else {
                mainSwagger["paths"] = {...mainSwagger["paths"], ...swaggerFile};
                pathNames.push(pathName_withParams);
            }
        }
    }
    catch{}
}


function getRouteStatus(swaggerObject:any, pathName:string){
    let registeredRouteKey = Object.keys(swaggerObject[pathName])[0].toUpperCase()+":/"+pathName.split("/")[1]
    let route = null
    let hasJwt = false
    let isActive = false
    for(let module of npModuleController.registeredModules) route = module._route[registeredRouteKey] || route
    if(!route) throw "swagger failed to find registered route "+pathName
    hasJwt = route.jwtProfile!=null
    isActive = route.isRouteActive || false
    let params = ""
    for(let param of route.urlParams) params += "/{"+param+"}"
    return [params, route.urlParams, isActive, hasJwt]
}