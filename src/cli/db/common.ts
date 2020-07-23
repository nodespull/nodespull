import fs from "fs"
import cmd from "../exe/exe"
import {appModule} from "../../install"
const root = appModule;


export function getCurrentDBVersion():number{
    if(!fs.existsSync(root+"/database")) return 0
    const dbDirents = fs.readdirSync(root+"/database", { withFileTypes: true });
    for(let dirName of getDirNames(dbDirents)) if(dirName.slice(0,4) == "at.v") return Number(dirName.slice(4))
    return 0
}


function getDirNames(dirents:fs.Dirent[]):string[]{
    return dirents
        .filter(dirent => !dirent.isFile())
        .map(dirent => dirent.name);
}