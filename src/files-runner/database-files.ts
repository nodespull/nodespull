import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Database_FilesLoader extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.getDbModule(), "database.js", {runFiles:true});

    }
}