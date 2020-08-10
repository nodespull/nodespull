import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Database_FilesLoader extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.dbModule, "database.js", {runFiles:true});

    }
}