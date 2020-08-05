
import {cmd} from "../exe/exe.log"
import fs from "fs"
import {appDockerfile,heroku_db_dockerfile} from "../deploy/templates/dockerfile"
import {writeJSON, parseJSON} from "../../etc/system-tools/json"
import stdin from "../../etc/system-tools/stdin";
import {PathVar} from "../../etc/other/paths"

let packageJson = parseJSON(PathVar.packageJson);
const rootFile = process.argv[1] //fs.readFileSync("./"+packageJson.main,"utf8");

//log into heroku
export async function herokuLogin(){
    await cmd("heroku", ["login"], false);
    await cmd("heroku", ["container:login"], false);
}


//create app
export function herokuCreateApp(){
    let appName = packageJson.name+"-"+getRandNumber();
    cmd("heroku", ["create", "-a", appName], false);
    //cmd("heroku", ["create", "-a", appName+"-db"], false);
    return appName;
}

//push
export async function herokuPush(){
    let appName = "";
    cmd("heroku",["apps"]);
    stdin("Enter app name (press `enter` for new app): ").then((name:string)=>{
        if(name && name != "") appName = name;
        else {// also upload mysql image to new app
            appName = herokuCreateApp()
           //uploadImage("./Dockerfile",heroku_db_dockerfile(),appName+"-db");
        }
        //add_dbSettings_toRootFile(appName);
        uploadImage("./Dockerfile",appDockerfile(),appName);
        //remove_dbSettings_fromRootFile();
    })
}

function add_dbSettings_toRootFile(appName:string){
    let config = `
        $.config.database({
            username: "root",
            passsord: "nodespull-db-password",
            host: "https://${appName}-db.herokuapp.com/",
            database: "nodespull-db-database",
            port: "3306"
        })
    `
    let rootFileParts = rootFile.split("$.server.ready");
    if(rootFile.includes("db.config") || rootFile.includes("Database.config") || rootFile.includes("config.db")) return;
    fs.writeFileSync("./"+packageJson.main, rootFileParts[0]+config+"\n$.server.ready"+rootFileParts[1]);
}

function remove_dbSettings_fromRootFile(){
    fs.writeFileSync("./"+packageJson.main, rootFile, "utf8");
}


function uploadImage(path:string, dockerfile:string, appName:string){
    fs.writeFileSync(path,dockerfile, "utf8");
    console.log("\n\nThis might take a while. Please take a drink and relax..\n\n");
    cmd("heroku", ["container:push","web", "-a", appName])
    cmd("heroku", ["container:release", "web", "-a", appName]);
    console.log("preparing url... (20s)")
    setTimeout(() => {
        cmd("heroku", ["open", "-a", appName]);
        cmd("rm",["./",path]);
    }, 20000);
}



function getRandNumber(max?:number, min?:number){
    max = max?max:1000;
    min = min?min:100;
    let rand = min+ Math.round(Math.random()* (max-min));
    return rand;
}

