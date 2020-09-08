import cmd from "../../../exe/exe"
import fs from "fs"
import {PathVar} from "../../../../etc/other/paths"

import attribute from "./templates/attribute"
import relation from "./templates/relation"
import { getCurrentDBVersion } from "../../../../database/helpers/common"
import { DatabaseConnectionController } from "../../../../database/connection"
import { Log } from "../../../../etc/log"
import { error } from "../../.."

const templates: {[_:string]:any} = { attribute, relation};


function getTemplate(template:string, tableName:string, dbConnectionSelector:string):string{
    return templates[template](tableName, dbConnectionSelector);
}


export async function newTable(arg:string){
    let dbConnectionSelector = arg.split("/")[0]
    if(!["link"].includes(dbConnectionSelector.split(".")[1])) throw error.wrongUsage
    else dbConnectionSelector = dbConnectionSelector.split(".")[0]
    let tableName = arg.split("/")[1]
    if(!tableName) throw error.wrongUsage

    DatabaseConnectionController.throwIfNotRegistered(dbConnectionSelector)

    let currVersion = getCurrentDBVersion(dbConnectionSelector)
    
    await cmd("mkdir", ["-p", PathVar.getDbModule()+`/${dbConnectionSelector}-db/stage.v${currVersion+1}/`+tableName+".model"], false);
    await cmd("mkdir", ["-p", PathVar.getDbModule()+`/${dbConnectionSelector}-db/archives`], false);

    for(let template of Object.keys(templates)){
        let path = PathVar.getDbModule()+`/${dbConnectionSelector}-db/stage.v${currVersion+1}/`+tableName+".model/"+tableName+"."+template+".js";
        await cmd("touch",[path]), false;
        await fs.writeFile(path,getTemplate(template, tableName, dbConnectionSelector),()=>{})
    }
}