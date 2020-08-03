import fs from "fs"
import cmd from "../../exe/exe"
import {dbModule} from "../../../install"
const root = dbModule;


export function getCurrentDBVersion():number{
    if(!fs.existsSync(root+"/SQL")) return 0
    const dbDirents = fs.readdirSync(root+"/SQL", { withFileTypes: true });
    for(let dirName of getDirNames(dbDirents)) if(dirName.slice(0,4) == "at.v") return Number(dirName.slice(4))
    return 0
}


function getDirNames(dirents:fs.Dirent[]):string[]{
    return dirents
        .filter(dirent => !dirent.isFile())
        .map(dirent => dirent.name);
}