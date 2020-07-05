/**
 * Runs auto-generated route and table files
 */

import fs from "fs"
import {appModule} from "./install"

const rootPath = __dirname+`/../../${appModule}/`;

recursiveRun(rootPath, "model.js");
recursiveRun(rootPath, "relation.js");

recursiveRun(rootPath, "module.js");
recursiveRun(rootPath, "func.js");

recursiveRun(rootPath, "delete.js");
recursiveRun(rootPath, "get.js");
recursiveRun(rootPath, "head.js");
recursiveRun(rootPath, "post.js");
recursiveRun(rootPath, "put.js");



/**
 * run all .js file recursively, given a folder
 */
export function recursiveRun(path: string, extension:string){
    try{
        const dirents = fs.readdirSync(path, { withFileTypes: true });

        const fileNames:string[] = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
    
        const folderNames:string[] = dirents
            .filter(dirent => !dirent.isFile())
            .map(dirent => dirent.name);
        
        for(let folderName of folderNames) recursiveRun(path+"/"+folderName, extension);
        for(let fileName of fileNames) {
            if(fileName.slice(-1*(extension.length+1)).toLowerCase() === "."+extension.toLowerCase()) require(path+"/"+fileName);
        }
    }
    catch{}
}