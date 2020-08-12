import fs from "fs"
import {PathVar} from "../../etc/other/paths"
import { DatabaseConnectionController } from "../connection"
import { Log } from "../../etc/log"

export function getCurrentDBVersion(dbName:string):number{
    const dbPath = dbName+"-db"
    if(!fs.existsSync(PathVar.getDbModule()+"/"+dbPath)) return 0
    const dbDirents = fs.readdirSync(PathVar.getDbModule()+"/"+dbPath, { withFileTypes: true });
    for(let dirName of getDirNames(dbDirents)) if(dirName.slice(0,4) == "at.v") return Number(dirName.slice(4))
    return 0
}



function getDirNames(dirents:fs.Dirent[]):string[]{
    return dirents
        .filter(dirent => !dirent.isFile())
        .map(dirent => dirent.name);
}

