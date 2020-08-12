import {cmd} from "../../exe/exe.log"
import fs from "fs"
import {PathVar} from "../../../etc/other/paths"

import getDatabaseTemplate from "./templates/database.template"
import { StringParser } from "../../../etc/system-tools/string-validator";
import { Log } from "../../../etc/log";

const root = PathVar.getDbModule();

export async function newDatabase(dbSelector:string){
    if(!StringParser.isExtendedAlphaNum(dbSelector)) throw new Log("ERR: expected alphanumeric for db selector").FgRed().getValue()

    cmd("mkdir", ["-p", root+"/"+dbSelector+"-db"]);

    // cmd("mkdir", ["-p", root+"/"+moduleDirName+"/graphql"]);
    cmd("touch",[root+"/"+dbSelector+"-db/"+dbSelector+".database.js"]); // create module file
    fs.writeFile(root+"/"+dbSelector+"-db/"+dbSelector+".database.js", getDatabaseTemplate(dbSelector),()=>{}) // populate module file with template
}
