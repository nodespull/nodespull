import {cmd} from "../../../exe/exe.log"
import fs from "fs"
import {PathVar} from "../../../../etc/other/paths"

import getDatabaseTemplate from "./templates/database.template"
import { StringParser } from "../../../../etc/system-tools/string-validator";
import { Log } from "../../../../etc/log";
import { DatabaseConnectionController } from "../../../../database/connection";

const root = PathVar.getDbModule();

export async function newDB(dbSelector:string){

    if(!StringParser.isExtendedAlphaNum(dbSelector)) throw new Log("ERR: expected alphanumeric for db selector").FgRed().getValue()

    if(Object.keys(DatabaseConnectionController.connections).includes(dbSelector)) 
            throw new Log(`database '${dbSelector}' already exists`).FgRed().getValue()

    cmd("mkdir", ["-p", root+"/"+dbSelector+"-db"]);

    // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/graphql"]);
    cmd("touch",[root+"/"+dbSelector+"-db/"+dbSelector+".link.js"]); // create module file
    fs.writeFile(root+"/"+dbSelector+"-db/"+dbSelector+".link.js", getDatabaseTemplate(dbSelector),()=>{}) // populate module file with template
}

