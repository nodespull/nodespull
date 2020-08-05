
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
import getAppEnvTemplate from "./templates/app-env"

export const rootFile_name:string = "server.js"
export let project_name:string = ""

export let etc_os_dir:string = ".etc/os";
export let etc_var_dir:string = ".etc/var";

export let appModule  = "src/app"
export let dbModule = "src/database"
export let appEnvModule = "src/environment"

export async function install(projectName:string, serverPort:number, pull_all:boolean, setupDb:Function, dbTools:any, dbConstroller:any){
    project_name = projectName
    console.log("\n** nodespull setup **\n");
    await install_core();
    if(pull_all) await install_others(serverPort);
    console.log("\n.. 100% - complete.\n")
    // await run("readme", "open", ["-a", "TextEdit", "nodespull-README.md"],(ok:boolean,data?:any)=>{})

    setupDb(dbConstroller);
}


async function install_core(){
    // installs for os (docker files) and np's npm dependencies
    await run("mkdir sys", "mkdir", ["-p",etc_os_dir],(ok:boolean,data?:any)=>{})
    await run("npm MySQL2", "sudo", ["npm", "i","mysql2"],(ok:boolean,data?:any)=>{})
    //database
    await run("create np database", "mkdir", ["-p", dbModule+"/SQL"],(ok:boolean,data?:any)=>{})
    await run("database", "mkdir", ["-p", dbModule+"/noSQL"],(ok:boolean,data?:any)=>{})
    //app env
    await run("create np appEnvir", "mkdir", ["-p", appEnvModule],(ok:boolean,data?:any)=>{
        run("app local env", "touch", [appEnvModule+"/app.local.env.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(appEnvModule+"/app.local.env.js", getAppEnvTemplate("local"),()=>{})
        })
        run("app prod env", "touch", [appEnvModule+"/app.prod.env.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(appEnvModule+"/app.prod.env.js", getAppEnvTemplate("prod"),()=>{})
        })
    })

    // main module
    await run("mkdir nodespull app", "mkdir", ["-p", appModule],(ok:boolean,data?:any)=>{})
    await run("main module", "mkdir", ["-p", appModule+"/main-module"],(ok:boolean,data?:any)=>{
        run("main module configs", "touch", [appModule+"/main-module/main.module.js"],(ok:boolean,data?:any)=>{
            if(ok)fs.writeFile(appModule+"/main-module/main.module.js", getModuleTemplate("mainModule"),()=>{}) // populate module file with template
        })
    })
    await run("graphql", "mkdir", ["-p", appModule+"/main-module/graphql"],(ok:boolean,data?:any)=>{})
    await run("rest", "mkdir", ["-p", appModule+"/main-module/rest"],(ok:boolean,data?:any)=>{})
    await run("services", "mkdir", ["-p", appModule+"/main-module/services"],(ok:boolean,data?:any)=>{})

}

async function install_others(serverPort:number){

    let dbPort = 3333;
    let dbPortTest = DB_PORT_TEST;
    let dbConsoleport=8889;
    let serverWaitTime_forDB = 300; //sec

    // serverPort = parseInt(await stdin(". Specify Local Port from which to launch node.js (Enter to skip): > ")) || serverPort;
    // dbConsoleport = parseInt(await stdin(". Port for nodespull local Database Portal (Enter to skip): > ")) || dbConsoleport;
    //dbPort = parseInt(await stdin(". Port for the nodespull local SQL Database  (Enter to skip): > ")) || dbPort;
    await run("README.md", "touch", ['./README.md'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("README.md",nodespullReadme(data)
        ,(err:any)=>{});
        else console.log("Error: README.md");
    }, {serverPort,dbConsoleport,rootFile_name});

    await run("Dockerfile", "touch", ["./"+etc_os_dir+'/Dockerfile'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("./"+etc_os_dir+"/Dockerfile",dockerfile(data)
        ,(err:any)=>{});
        else console.log("Error: Dockerfile");
    }, {serverPort,rootFile_name});

    await run("docker-compose-all", "touch", ["./"+etc_os_dir+'/docker-compose-all.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("./"+etc_os_dir+"/docker-compose-all.yml",dockerComposeAll(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-all.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, etc_os_dir, dbPortTest});

    await run("docker-compose-db", "touch", ["./"+etc_os_dir+'/docker-compose-db.yml'], (ok:boolean, data?:any)=>{
        if(ok) fs.writeFile("./"+etc_os_dir+"/docker-compose-db.yml",dockerComposeDB(data)
        ,(err:any)=>{});
        else console.log("Error: docker-compose-db.yml");
    }, {serverPort, dbPort, dbConsoleport, rootFile_name, serverWaitTime_forDB, etc_os_dir, dbPortTest});

    await run("wait-for-it", "touch", ["./"+etc_os_dir+"/wait-for-it.sh"], (ok:boolean, data?:any)=>{
        if(ok){
            fs.writeFile("./"+etc_os_dir+"/wait-for-it.sh", waitForIt(),(err:any)=>{})
        }
    })

    await run("wait-for-it chmod write", "sudo", ["chmod", "+x","./"+etc_os_dir+"/wait-for-it.sh"],(ok:boolean,data?:any)=>{})
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