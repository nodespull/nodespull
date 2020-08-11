
const execa = require('execa');
const fs = require("fs");

import {userInput} from "./etc/system-tools/stdin"
import {DB_PORT_TEST} from "./server"
import {getCmd as cliCmd} from "./cli"

// files list
import dockerfile from "./etc/developer-op-files/dockerfile";
import dockerComposeAll from "./etc/developer-op-files/docker-compose-all";
import dockerComposeDB from "./etc/developer-op-files/docker-compose-db";
import nodespullReadme from "./etc/developer-op-files/nodespull-README";
import waitForIt from "./etc/developer-op-files/wait-for-it";
import getAppEnvTemplate from "./templates/app-env"
import { PathVar } from "./etc/other/paths"

export const rootFile_name:string = "server.js"
export let project_name:string = ""


export async function install(projectName:string, serverPort:number, pull_all:boolean, /*setupDb:Function, dbTools:any/*, dbConstroller:any*/){
    project_name = projectName
    console.log("\n** nodespull setup **\n");
    await install_core();
    if(pull_all) await install_others(serverPort);
    console.log("\n.. 100% - complete.\n")
    // await run("readme", "open", ["-a", "TextEdit", "nodespull-README.md"],(ok:boolean,data?:any)=>{})

    //setupDb(dbConstroller);
}


async function install_core(){
    // installs for os (docker files) and np's npm dependencies
    await run("sys config", "mkdir", ["-p",PathVar.etc_os_dir],(ok:boolean,data?:any)=>{})
    await run("MySQL2 setup", "sudo", ["npm", "i","mysql2"],(ok:boolean,data?:any)=>{})
    //database
    await run("config database MS", "mkdir", ["-p", PathVar.dbModule],(ok:boolean,data?:any)=>{})
    // await run("database", "mkdir", ["-p", PathVar.dbModule+"/noSQL"],(ok:boolean,data?:any)=>{})
    //app env
    await run("setup np appEnvir", "mkdir", ["-p", PathVar.appEnvModule],(ok:boolean,data?:any)=>{
        run("app local env", "touch", [PathVar.appEnvModule+"/app.local.env.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(PathVar.appEnvModule+"/app.local.env.js", getAppEnvTemplate("local"),()=>{})
        })
        run("app prod env", "touch", [PathVar.appEnvModule+"/app.prod.env.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(PathVar.appEnvModule+"/app.prod.env.js", getAppEnvTemplate("prod"),()=>{})
        })
    })
    await run("config jwt auth profile", "mkdir", ["-p", PathVar.root+"/auth/jwt"],(ok:boolean,data?:any)=>{})
    await run("config oauth auth profile", "mkdir", ["-p", PathVar.root+"/auth/oauth2"],(ok:boolean,data?:any)=>{})

    // main module
    await run("create app files", "mkdir", ["-p", PathVar.appModule],(ok:boolean,data?:any)=>{})
    cliCmd("c module main", false)
}

async function install_others(serverPort:number){

    let dbPort = 3333;
    let dbPortTest = DB_PORT_TEST;
    let dbConsoleport=8889;
    let serverWaitTime_forDB = 300; //sec

    // serverPort = parseInt(await userInput(". Specify Local Port from which to launch node.js (Enter to skip): > ")).promise || serverPort;
    // dbConsoleport = parseInt(await userInput(". Port for nodespull local Database Portal (Enter to skip): > ")).promise || dbConsoleport;
    //dbPort = parseInt(await userInput(". Port for the nodespull local SQL Database  (Enter to skip): > ")).promise || dbPort;
    await run("README.md", "touch", ['./README.md'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("README.md",nodespullReadme(data)
        ,(err:any)=>{});
        else console.log("Error: README.md");
    }, {serverPort,dbConsoleport,rootFile_name});

    await run("Dockerfile", "touch", [PathVar.etc_os_dir+'/Dockerfile'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(PathVar.etc_os_dir+"/Dockerfile",dockerfile(data)
        ,(err:any)=>{});
        else console.log("Error: Dockerfile");
    }, {serverPort,rootFile_name});

    await run("docker-compose-all", "touch", [PathVar.etc_os_dir+'/docker-compose-all.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(PathVar.etc_os_dir+"/docker-compose-all.yml",dockerComposeAll(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-all.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, dbPortTest});

    await run("docker-compose-db", "touch", [PathVar.etc_os_dir+'/docker-compose-db.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(PathVar.etc_os_dir+"/docker-compose-db.yml",dockerComposeDB(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-db.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, dbPortTest});

    await run("wait-for-it", "touch", [PathVar.etc_os_dir+"/wait-for-it.sh"], (ok:boolean, data?:any)=>{
        if(ok){
            fs.writeFile(PathVar.etc_os_dir+"/wait-for-it.sh", waitForIt(),(err:any)=>{})
        }
    })

    await run("wait-for-it chmod write", "sudo", ["chmod", "+x",PathVar.etc_os_dir+"/wait-for-it.sh"],(ok:boolean,data?:any)=>{})
    // await run("npm","install",["-g","nodemon"], (ok:boolean, data?:any)=>{});
    // await run("npm","install",["-g","heroku"], (ok:boolean, data?:any)=>{});
   // await run("npm","install",["-g","sequelize-cli"], (ok:boolean, data?:any)=>{});
}


async function run(name:string, cmd:string, options:string[], callback?:Function, data?:any){
    //if(cmd=="touch" && fs.existsSync("./"+options[0])) return callback?callback(true,data):null;
    if(cmd=="sudo") console.log("\n. \""+name+"\" uses admin level permission")
    await (async () => {
        try {
            const {stdout} = await execa(cmd, options);
            //console.log(stdout);
            //console.log(". "+name);
            if(callback) callback(true, data);
        } catch (error) {
            console.log("- failed to configure "+name+" with exitCode: "+error.exitCode);
            if(callback) callback(false, data)
        }
    })();
}