
const execa = require('execa');
const fs = require("fs");

import {getCmd as cliCmd} from "./cli"

// files list
import dockerfile from "./etc/developer-op-files/dockerfile";
import dockerComposeAll from "./etc/developer-op-files/docker-compose-all";
import dockerComposeDB from "./etc/developer-op-files/docker-compose-db";
import nodespullReadme from "./etc/developer-op-files/nodespull-README";
import waitForIt from "./etc/developer-op-files/wait-for-it";
import getAppEnvTemplate from "./env/templates"
import { PathVar } from "./etc/other/paths"
import { Log } from "./etc/log";
import bootconfStore from "./bootstrap/bootconf/bootconf-store";


export const rootFile_name:string = "server.js"
export let project_name:string = ""


export async function initializeNodespull(){
    let projectName:string|null = process.argv[3] || null
    if(!projectName){
        new Log("Project name required for creation").FgRed().printValue()
        process.exit(1)
    }
    project_name = projectName
    console.log("\n** nodespull setup **\n");
    await install_core();
    await install_others(bootconfStore.server.PORT);
    console.log("\n.. 100% - complete.\n")
}


async function install_core(){
    // installs for os (docker files) and np's npm dependencies
    await run("sys config", "mkdir", ["-p",PathVar.getEtc_os_dir()],(ok:boolean,data?:any)=>{})
    await run("MySQL2 setup", "sudo", ["npm", "i","mysql2"],(ok:boolean,data?:any)=>{})
    //database
    await run("config database MS", "mkdir", ["-p", PathVar.getDbModule()],(ok:boolean,data?:any)=>{})
    //app env
    await run("setup np appEnvir", "mkdir", ["-p", PathVar.getAppEnvModule()],(ok:boolean,data?:any)=>{
        run("app local env", "touch", [PathVar.getAppEnvModule()+"/app.local.env.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(PathVar.getAppEnvModule()+"/app.local.env.js", getAppEnvTemplate("local"),()=>{})
        })
        run("app prod env", "touch", [PathVar.getAppEnvModule()+"/app.prod.env.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(PathVar.getAppEnvModule()+"/app.prod.env.js", getAppEnvTemplate("prod"),()=>{})
        })
    })
    await run("config jwt auth profile", "mkdir", ["-p", PathVar.getSrc()+"/auth/jwt"],(ok:boolean,data?:any)=>{})
    await run("config oauth auth profile", "mkdir", ["-p", PathVar.getSrc()+"/auth/oauth2"],(ok:boolean,data?:any)=>{})

    // main module
    await run("create app files", "mkdir", ["-p", PathVar.getAppModule()],(ok:boolean,data?:any)=>{})
    cliCmd("c module main", false, {silent:true})
}

async function install_others(serverPort:number){

    let dbPort = 3333;
    let dbPortTest = 9001;
    let dbConsoleport=8889;
    let serverWaitTime_forDB = 300; //sec


    await run("README.md", "touch", ['./README.md'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("README.md",nodespullReadme(data)
        ,(err:any)=>{});
        else console.log("Error: README.md");
    }, {serverPort,dbConsoleport,rootFile_name});

    await run("Dockerfile", "touch", [PathVar.getEtc_os_dir()+'/Dockerfile'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(PathVar.getEtc_os_dir()+"/Dockerfile",dockerfile(data)
        ,(err:any)=>{});
        else console.log("Error: Dockerfile");
    }, {serverPort,rootFile_name});

    await run("docker-compose-all", "touch", [PathVar.getEtc_os_dir()+'/docker-compose-all.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(PathVar.getEtc_os_dir()+"/docker-compose-all.yml",dockerComposeAll(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-all.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, dbPortTest});

    await run("docker-compose-db", "touch", [PathVar.getEtc_os_dir()+'/docker-compose-db.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile(PathVar.getEtc_os_dir()+"/docker-compose-db.yml",dockerComposeDB(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-db.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, dbPortTest});

    await run("wait-for-it", "touch", [PathVar.getEtc_os_dir()+"/wait-for-it.sh"], (ok:boolean, data?:any)=>{
        if(ok){
            fs.writeFile(PathVar.getEtc_os_dir()+"/wait-for-it.sh", waitForIt(),(err:any)=>{})
        }
    })

    await run("wait-for-it", "sudo", ["chmod", "+x",PathVar.getEtc_os_dir()+"/wait-for-it.sh"],(ok:boolean,data?:any)=>{})

}


async function run(name:string, cmd:string, options:string[], callback?:Function, data?:any){
    if(cmd=="sudo") console.log("\n. \""+name+"\" uses admin level permission .. ")
    await (async () => {
        try {
            const {stdout} = await execa(cmd, options);
            if(callback) callback(true, data);
        } catch (error) {
            console.log("- failed to configure "+name+" with exitCode: "+error.exitCode);
            if(callback) callback(false, data)
        }
    })();
}