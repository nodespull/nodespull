
import swagger_defaultContent from "./default-content"
import {writeJSON, parseJSON} from "../../etc/system-tools/json"
import {cmd} from "../../cli/exe/exe.log"
import fs from "fs"
import {etc_var_dir, appModule} from "../../install"
const swaggerUi = require('swagger-ui-express');
const packageJson = parseJSON("../package.json");


let mainSwagger:any = {};

export default function(app:any){
    if(!fs.existsSync("./"+etc_var_dir+"/swagger.json")){
        cmd("mkdir", ["-p","./"+etc_var_dir]);
        cmd("touch", ["./"+etc_var_dir+"/swagger.json"]);
        writeJSON("./"+etc_var_dir+"/swagger.json", swagger_defaultContent());
    }
    try{
        let docs:any;
        docs = parseJSON("./"+etc_var_dir+"/swagger.json");
        //build swager file
        recursiveBuild("./"+appModule);
        if(JSON.stringify(docs) != JSON.stringify({...swagger_defaultContent(), ...mainSwagger})){
            writeJSON("./"+etc_var_dir+"/swagger.json", {...swagger_defaultContent(), ...mainSwagger});
        }
        //load swagger file
        docs = parseJSON("./"+etc_var_dir+"/swagger.json");
        app.use('/api-docs', function(req:any, res:any, next:any){
            docs.host = req.get('host');
            req["swaggerDoc"] = docs;
            next();
        }, swaggerUi.serve, swaggerUi.setup());
    }catch{
        console.log(`swagger file has invalid format. Please delete file "${etc_var_dir}/swagger.json" and try again`)
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
            let swaggerPath = parseJSON(path+"/"+fileName);
            let pathName = Object.keys(swaggerPath)[0];
            if(pathNames.includes(pathName)) mainSwagger["paths"][pathName] = {...mainSwagger["paths"][pathName], ...swaggerPath[pathName]};
            else {
                mainSwagger["paths"] = {...mainSwagger["paths"], ...swaggerPath};
                pathNames.push(pathName);
            }
        }
    }
    catch{}
}