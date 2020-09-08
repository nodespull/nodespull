
import fs from "fs"
import {herokuCreateApp, herokuLogin, herokuPush} from "../heroku/heroku"
import {rootFile_name} from "../../install"
import strGen from "../../etc/system-tools/string-gen"
import {cmd} from "../exe/exe.log"
import {parseJSON, writeJSON} from "../../etc/system-tools/json"
import { Log } from "../../etc/log"

const deployFileName = "deploy.md";
let packageJson:any;
let appName:string;

export async function deploy(){
    let target:string = process.argv[3]
    if(!target || target == "undefined") new Log("Err: target cloud vendor not provided").FgRed().printValue()
    else switch(target){
        case("heroku"):{
            new Log("\nPreparing for deployment to Heroku.").FgGreen().printValue()
            new Log("\nNote: visit 'https://nodespull.org/learn?at=docsWorkflowDeployment' to learn about nodespull deployment\n").FgYellow().printValue()
            await herokuLogin();
            await herokuPush();
            break
        }
        default:
            new Log(`cloud vendor '${target}' is not supported`).throwWarn()
    }
    //loadPackageJsonContent();
    // await herokuLogin();
    // if(packageJson["heroku-app"] && packageJson["heroku-app"] != "null"){
    //     await push(appName);
    // }else{
    //modifyPackageJson();
    // await herokuPush();
    //}
}

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// function loadPackageJsonContent(){
//     packageJson = parseJSON("./package.json");
//     appName = packageJson.name+"-"+getRandNumber();
// }

// function modifyPackageJson(){
//     packageJson.scripts["start"] = "node "+packageJson.main+" run";
//     packageJson["heroku-app"] = appName;
//     writeJSON("./package.json", packageJson);
// }


// function getRandNumber(max?:number, min?:number){
//     max = max?max:1000;
//     min = min?min:100;
//     let rand = min+ Math.round(Math.random()* (max-min));
//     return rand;
// }



