import cmd from "../exe/exe"
import fs from "fs"

import model from "./templates/model"
import relation from "./templates/relation"
const templates: {[_:string]:any} = { model, relation};

function getTemplate(template:string, tableName:string, pk?:any):string{
    if(pk)pk.type = pk.type.toLowerCase().startsWith("i")?"int":"string";
    return templates[template](tableName, pk);
}


const root = "app.modules";

export async function newTable(tableName:string, _pk?:string){
    let pk:any = undefined;
    if(_pk) pk = {attr: _pk.split(":")[0], type: _pk.split(":")[1]};
    await cmd("mkdir", ["-p", root+"/tables"], false);
    await cmd("mkdir", ["-p", root+"/tables/"+tableName], false);
    for(let template of Object.keys(templates)){
        let path = root+"/tables/"+tableName+ "/"+tableName+"."+template+".js";
        await cmd("touch",[path]), false;
        await fs.writeFile(path,getTemplate(template, tableName, pk),()=>{})
    }
}