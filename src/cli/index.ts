import {customStdinResponse, userInput} from "../etc/system-tools/stdin"
import {newRoute} from "./route"
import { newDatabase } from "./database/db";
import { newTable } from "./database/table"
import { newModule } from "./module";
import { newService } from "./service";
import { Log } from "../etc/log";
import { cliStack } from "../etc/system-tools/stdin";
import { newAuthProfile } from "./auth";

let stdinInterface:customStdinResponse

export function start(){
    new Log(`\n*** Nodespull Interactive Mode ***  \n(enter 'help' for info)`).printValue()
    main();
}

async function main(){
    stdinInterface = userInput("\n>> ");
    let input = await stdinInterface.getPromise()
    getCmd(input, true);
}


export async function getCmd(input:string, loop:boolean){
    if(input != cliStack[cliStack.length-1] && input.length > 0) cliStack.push(input)
    if(input == "clear"){
        stdinInterface.interface.removeAllListeners()
        stdinInterface.interface.close()
        process.stdout.write('\x1b[2J');
        process.stdout.moveCursor(0, -1*process.stdout.rows);
        new Log(`\n*** Nodespull Interactive ***  \n(enter 'help' for info)`).printValue()
        return main()
    }
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
                new Log("\nModudle \""+ name+"\" successfully created").FgGreen().printValue()
                break;
            case "route": 
                if(createCmd.includes(userCmd)) await newRoute(name);
                else throw error.falseCmd;
                new Log("\nRoute \""+ name+"\" successfully created").FgGreen().printValue()
                break;
            case "service": 
                if(createCmd.includes(userCmd)) await newService(args.slice(2));
                else throw error.falseCmd;
                new Log("\nService \""+ args[3]+"\" successfully created").FgGreen().printValue()
                break;
            case "profile": 
                if(createCmd.includes(userCmd)) await newAuthProfile(args.slice(2));
                else throw error.falseCmd;
                new Log("\nAuth Profile \""+ args[3]+"\" successfully created").FgGreen().printValue()
                break;
            case "database": 
                if(createCmd.includes(userCmd)) await newDatabase(name);
                else throw error.falseCmd;
                new Log("\nDatabase \""+ name+"\" successfully created").FgGreen().printValue()
                break;
            case "table": 
                if(createCmd.includes(userCmd)) await newTable(args[2]);
                else throw error.falseCmd;
                new Log("\nTable \""+ name+"\" successfully created").FgGreen().printValue()
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
        create module   <name>                   : generate module
        create database <name>                   : generate route at path <path/path>
        create table    <selector.database/name> : generate table/model for specified db
        create service  <name>                   : generate service
        create profile  <name>                   : generate auth profile
        create route    <path/path>              : generate route at path <path/path>

    To target modules, add the module name before the name of the element as follow:
    - i.e. create <entity> <moduleName>.module/<entityName>
    - e.g. create service shared.module/myservice 

    Service
    The 'service' entity uses the flags:
        --boot | -b     : generate self-booting service
        --pipe | -p     : generate pipe-usable service
    e.g. create service -b core.module/socket

    Auth Profile
    The 'profile' entity uses the flags:
        --jwt           : generate jwt auth profile
        --oauth2 |      : generate oauth2 auth profile
    e.g. create profile --jwt main

    
    q | quit | exit        : exit nodespull cli
    h | help | info | ?    : view available commands`);
    main();
}



function exit(){
    new Log("Exiting Interactive mode...").FgBlue().printValue()
}


export const error = {
    falseCmd: new Log("ERR: Command not recognized. Enter `help` for info").FgRed().getValue(),
    falseNameFormat: new Log("ERR: Name format incorrect").FgRed().getValue(),
    wrongUsage: new Log("ERR: command usage incorrect").FgRed().getValue()
}