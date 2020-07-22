import cmd from "../exe/exe"
import fs from "fs"
import {appModule} from "../../install"

import model from "./templates/model"
import relation from "./templates/relation"
import { getCurrentDBVersion } from "./common"

const templates: {[_:string]:any} = { model, relation};

const root = appModule;

function getTemplate(template:string, tableName:string):string{
    return templates[template](tableName);
}


export async function newTable(tableName:string){
    let currVersion = getCurrentDBVersion()
    await cmd("mkdir", ["-p", root+`/database/stage.v${currVersion+1}/`+tableName], false);
    for(let template of Object.keys(templates)){
        let path = root+`/database/stage.v${currVersion+1}/`+tableName+ "/"+tableName+"."+template+".js";
        await cmd("touch",[path]), false;
        await fs.writeFile(path,getTemplate(template, tableName),()=>{})
    }
}