import stdin from "../etc/system-tools/stdin"
import {newRoute} from "./route"
import {newTable} from "./db/sql"
import { newModule } from "./module";
import { newService } from "./service";

export function start(){
    console.log("\n*** Nodespull CLI ***  \n(`help` for info)");
    main();
}

async function main(){
    let input = await stdin("\n>> ");
    getCmd(input, true);
}


export async function getCmd(input:string, loop:boolean){
    let createCmd = ["create", "c"];
    try{
        let args = input.split(" ");

        let userCmd = args[0];
        if(["help","h","info","?"].includes(userCmd)) return help();
        if(["q","quit","exit"].includes(userCmd)) return exit();
        if(userCmd.trim() == "") return !loop?null:main();

        let name = args[2]? args[2].toLowerCase():undefined;
        if(!name || name.includes("\"") || name.includes("'") || name.includes("`")) throw error.falseNameFormat;
        
        switch (args[1]) {
            case "module": 
                if(createCmd.includes(userCmd)) await newModule(name);
                else throw error.falseCmd;
                console.log("\nModule \""+ name+"\" successfully created")
                break;
            case "route": 
                if(createCmd.includes(userCmd)) await newRoute(name);
                else throw error.falseCmd;
                console.log("\nRoute \""+ name+"\" successfully created")
                break;
            case "service": 
                if(createCmd.includes(userCmd)) await newService(args.slice(2));
                else throw error.falseCmd;
                console.log("\nService \""+ name+"\" successfully created")
                break;
            case "table": 
                if(createCmd.includes(userCmd)) await newTable(name);
                else throw error.falseCmd;
                console.log("\nTable \""+ name+"\" successfully created")
                break;
            default:
                throw error.falseCmd;
        }

        if(loop) main()
    }catch(e){
        console.log(e);
        if(loop) main();
    }
}


function help(){
    console.log(`
commands:
    Create
    Use the 'create' or 'c' command as follow:
        create module  <name>       : generate module
        create table   <name>       : generate database table/model
        create service <name>       : generate service
        create route   <path/path>  : generate route at path <path/path>

    To target modules, add the module name before the name of the element as follow:
    - i.e. create <entity> <moduleName>.module/<entityName>
    - e.g. create service shared.module/myservice 

    Service
    The 'service' entity uses the flags:
        --boot | -b     : generate self-booting service
        --pipe | -p     : generate pipe-usable service
    e.g. create service -b core.module/socket

    
    q | quit | exit        : exit nodespull cli
    h | help | info | ?    : view available commands`);
    main();
}



function exit(){
    console.log("Exiting CLI...");
}


export const error = {
    falseCmd: "ERR: Command not recognized. Enter `help` for info.",
    falseNameFormat: "ERR: Name format incorrect.",
    wrongUsage: "ERR: command usage incorrect"
}