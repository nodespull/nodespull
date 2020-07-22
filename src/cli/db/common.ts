import fs from "fs"
import cmd from "../exe/exe"
import {appModule} from "../../install"
const root = appModule;


export function getCurrentDBVersion():number{
    let rootDirs = fs.readdirSync(root, { withFileTypes: true });
    let dbDirExists:boolean = false
    for(let dirName of getDirNames(rootDirs)) if(dirName == "database") dbDirExists = true
    if(!dbDirExists) cmd("mkdir", ["-p", root+"/database"], true);

    const dbDirents = fs.readdirSync(root+"/database", { withFileTypes: true });
    for(let dirName of getDirNames(dbDirents)) if(dirName.slice(0,4) == "at.v") return Number(dirName.slice(4))
    return 0
}


function getDirNames(dirents:fs.Dirent[]):string[]{
    return dirents
        .filter(dirent => !dirent.isFile())
        .map(dirent => dirent.name);
}