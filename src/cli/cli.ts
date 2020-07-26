import stdin from "../etc/system-tools/stdin"
import {newRoute} from "./route"
import {newTable} from "./db"
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
    create table <name>         : generate files for a new database table <name> !no quotes!
    create route <path/path>    : generate files for a new route at path <path/path> !no quotes!
    q | quit | exit             : exit nodespull cli
    h | help | info | ?         : view available commands`);
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