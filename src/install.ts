
const execa = require('execa');
const fs = require("fs");

import stdin from "./etc/system-tools/stdin"
import {DB_PORT_TEST} from "./server"

// files list
import dockerfile from "./etc/developer-op-files/dockerfile";
import dockerComposeAll from "./etc/developer-op-files/docker-compose-all";
import dockerComposeDB from "./etc/developer-op-files/docker-compose-db";
import nodespullReadme from "./etc/developer-op-files/nodespull-README";
import waitForIt from "./etc/developer-op-files/wait-for-it";
import { cmd } from "./cli/exe/exe.log";
import getModuleTemplate from "./cli/module/templates/module.template";

export const sys_dir:string = "nodespull";
export let rootFile_name = "nodespullApp";
export let appModule  = "app.module";

export async function install(rootFileName:string, serverPort:number, pull_all:boolean, setupDb:Function, dbTools:any, dbConstroller:any){
    rootFile_name = rootFileName;
    console.log("\n** nodespull setup **\n");
    await install_core();
    if(pull_all) await install_others(serverPort);
    console.log("\n.. 100% - complete.\n")
    await run("readme", "open", ["-a", "TextEdit", "nodespull-README.md"],(ok:boolean,data?:any)=>{})

    setupDb(dbConstroller);
}


async function install_core(){
    await run("mkdir sys", "mkdir", ["-p",sys_dir],(ok:boolean,data?:any)=>{})
    await run("npm MySQL2", "sudo", ["npm", "i","mysql2"],(ok:boolean,data?:any)=>{})
    //create app.module folder
    await run("mkdir nodespull app", "mkdir", ["-p", appModule],(ok:boolean,data?:any)=>{})
    await run("create np database", "mkdir", ["-p", appModule+"/database"],(ok:boolean,data?:any)=>{})
    await run("create np server", "mkdir", ["-p", appModule+"/server"],(ok:boolean,data?:any)=>{})
    await run("create np routes", "mkdir", ["-p", appModule+"/server/_routes"],(ok:boolean,data?:any)=>{})
    await run("create np services app", "mkdir", ["-p", appModule+"/server/_services"],(ok:boolean,data?:any)=>{})
    await run("create np default module", "touch", ["-p", appModule+"/server/server.module"],(ok:boolean,data?:any)=>{
        fs.writeFile(appModule+"/server/server.module.js", getModuleTemplate("serverModule"),()=>{}) // populate module file with template
    })

}

async function install_others(serverPort:number){

    let dbPort = 3333;
    let dbPortTest = DB_PORT_TEST;
    let dbConsoleport=8889;
    let serverWaitTime_forDB = 300; //sec

    // serverPort = parseInt(await stdin(". Specify Local Port from which to launch node.js (Enter to skip): > ")) || serverPort;
    dbConsoleport = parseInt(await stdin(". Port for nodespull local Database Portal (Enter to skip): > ")) || dbConsoleport;
    //dbPort = parseInt(await stdin(". Port for the nodespull local SQL Database  (Enter to skip): > ")) || dbPort;
    await run("nodespull-README", "touch", ['nodespull-README.md'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("nodespull-README.md",nodespullReadme(data)
        ,(err:any)=>{});
        else console.log("Error: nodespull-README");
    }, {serverPort,dbConsoleport,rootFile_name});

    await run("Dockerfile", "touch", [sys_dir+'/Dockerfile'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(sys_dir+"/Dockerfile",dockerfile(data)
        ,(err:any)=>{});
        else console.log("Error: Dockerfile");
    }, {serverPort,rootFile_name});

    await run("docker-compose-all", "touch", [sys_dir+'/docker-compose-all.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(sys_dir+"/docker-compose-all.yml",dockerComposeAll(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-all.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, sys_dir, dbPortTest});

    await run("docker-compose-db", "touch", [sys_dir+'/docker-compose-db.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(sys_dir+"/docker-compose-db.yml",dockerComposeDB(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-db.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, sys_dir, dbPortTest});

    await run("wait-for-it", "touch", [sys_dir+"/wait-for-it.sh"], (ok:boolean, data?:any)=>{
        if(ok){
            fs.writeFile(sys_dir+"/wait-for-it.sh", waitForIt(),(err:any)=>{})
        }
    })

    await run("wait-for-it chmod write", "sudo", ["chmod", "+x","./"+sys_dir+"/wait-for-it.sh"],(ok:boolean,data?:any)=>{})
    await run("npm","install",["-g","nodemon"], (ok:boolean, data?:any)=>{});
    await run("npm","install",["-g","heroku"], (ok:boolean, data?:any)=>{});
   // await run("npm","install",["-g","sequelize-cli"], (ok:boolean, data?:any)=>{});
}


async function run(name:string, cmd:string, options:string[], callback?:Function, data?:any){
    //if(cmd=="touch" && fs.existsSync("./"+options[0])) return callback?callback(true,data):null;
    if(cmd=="sudo") console.log("\n. \""+name+"\" requires admin level permission")
    await (async () => {
        try {
            const {stdout} = await execa(cmd, options);
            console.log(stdout);
            console.log("- configured \""+name+"\"");
            if(callback) callback(true, data);
        } catch (error) {
            console.log("- failed to configure "+name+" with exitCode: "+error.exitCode);
            if(callback) callback(false, data)
        }
    })();
}