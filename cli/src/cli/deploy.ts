
import fs from "fs"
import { sys_dir } from "../install";
import {create, login, push} from "./heroku/heroku"
import {rootFile_name} from "../install"
import {init, commit} from "./git"
import strGen from "../etc/system-tools/string-gen"
import {cmd} from "./exe/exe.log"
import {parseJSON, writeJSON} from "../etc/system-tools/json"

const deployFileName = "deploy.md";
let packageJson:any;
let appName:string;

export async function deploy(cliLoop:Function){
    loadPackageJsonContent();

    if(packageJson["heroku-name"]){
        await init();
        await login();
        await commit();
        await push();
    }else{
        modifyPackageJson();
        await init();
        await create();
        await login();
        await commit();
        await push();
    }
    cliLoop();
}


function loadPackageJsonContent(){
    packageJson = parseJSON("./package.json");
    appName = packageJson.name+"-"+strGen(4);
}

function modifyPackageJson(){
    packageJson.scripts["start"] = "node "+packageJson.main+" run";
    packageJson["heroku-name"] = appName;
    writeJSON("./package.json", packageJson);
}



