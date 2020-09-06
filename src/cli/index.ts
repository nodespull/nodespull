import { customStdinResponse, userInput } from "../etc/system-tools/stdin"
import { newRoute } from "./route"
import { newDatabase } from "./database/db";
import { newTable } from "./database/table"
import { newModule } from "./module";
import { newService } from "./service";
import { Log } from "../etc/log";
import { cliStack } from "../etc/system-tools/stdin";
import { newAuthProfile } from "./auth";
import { StringParser } from "../etc/system-tools/string-validator";
import { Module_FilesLoader } from "../files-runner/module-files";
import { Database_FilesLoader } from "../files-runner/database-files";
import { FilesLoader } from "../files-runner";
import { npModuleController } from "../module/controllers/npModuleController";

let stdinInterface:customStdinResponse

export function start(){
    new Log(`\n*** Nodespull Interactive Mode ***  \n(enter 'help' for info)`).printValue()
    main();
}

async function main(){
    FilesLoader.All()
    stdinInterface = userInput("\n>> ");
    let input = await stdinInterface.getPromise()
    getCmd(input, true);
}


export async function getCmd(input:string, loop:boolean, options?:CliCmdOptions_interface){
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

        let name = args[2]? args[2]:undefined;
        if(!name) throw error.falseNameFormat
        for(let arg of args.slice())
            if(args[1]!="route" && !StringParser.isValidCLIFormat(arg)) throw error.falseNameFormat
        
        switch (args[1]) {
            case "module": 
                if(createCmd.includes(userCmd)) await newModule(name);
                else throw error.falseCmd;
                if(options && options.silent) break
                new Log("\nModudle \""+ name+"\" successfully created").FgGreen().printValue()
                // new Log("restart cli to use new module").FgBlue().printValue()
                break;
            case "route": 
                let path = input.split(":")[0].split(" ")[2].toLowerCase()
                let methods = input.split(":")[1]?input.split(":")[1].split(" "):null
                if(!path || !StringParser.isValidCLIFormat(path)) throw error.wrongUsage
                if(createCmd.includes(userCmd)) await newRoute(path, methods);
                else throw error.falseCmd;
                new Log("\nRoute \""+ name+"\" successfully created").FgGreen().printValue()
                break;
            case "service": 
                if(createCmd.includes(userCmd)) await newService(args.slice(2));
                else throw error.falseCmd;
                new Log("\nService \""+ (args[3]?args[3]:args[2])+"\" successfully created").FgGreen().printValue()
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
                // new Log("restart cli to use new database").FgBlue().printValue()
                break;
            case "table": 
                if(createCmd.includes(userCmd)) await newTable(args[2]);
                else throw error.falseCmd;
                new Log("\nTable \""+ name+"\" successfully created").FgGreen().printValue()
                break;
            default:
                throw error.falseCmd;
        }
        console.log("updating "+args[1]+" tree..")
        setTimeout(() => {
            if(loop) main()
        }, 1000);
    }catch(e){
        console.log(e);
        if(loop) main();
    }
}


function help(){
    console.log(`

Use the '${new Log("create").FgGreen().getValue()}' or '${new Log("c").FgGreen().getValue()}' command as follow:
________________________________________________________________
Commands     Arguments                 Descriptions                
________________________________________________________________
c module     <name>                    module
c database   <name>                    database configs
c table      <dbname.'db'/name>        table in specified db
c route      <path/path?> : <methods?> route at path <path/path>
c service    <flag> <name>             service
c profile    <flag> <name>             auth profile
________________________________________________________________

${new Log("Service Flag").FgGreen().getValue()} options
--boot | -b     : self-booting service
--pipe | -p     : pipe-usable service

${new Log("Profile Flag").FgGreen().getValue()} options
--jwt           : jwt auth profile
--oauth2        : oauth2 auth profile

${new Log("Targeting modules").FgGreen().getValue()} for Service and Route
c service    <flag> <modname.'mod'/name>
c route      <modname.'mod'/path/path?>

${new Log("Methods").FgGreen().getValue()} for Route
e.g. c route main.mod/home/user : head get post put delete


`);
    main();
}



function exit(){
    new Log("Exiting Interactive mode...").FgBlue().printValue()
}


export const error = {
    falseCmd: new Log("ERR: Command not recognized. Enter `help` for info").FgRed().getValue(),
    falseNameFormat: new Log("ERR: arg format incorrect").FgRed().getValue(),
    wrongUsage: new Log("ERR: command usage incorrect").FgRed().getValue()
}


interface CliCmdOptions_interface{
    silent:boolean
}