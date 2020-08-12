import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Database_FilesLoader extends FilesEngine{
    static isLoaded:boolean = false
    static load(){
        if(Database_FilesLoader.isLoaded) return
        new Database_FilesLoader()
        Database_FilesLoader.isLoaded = true
    }
    constructor(){
        super()
        super.recursiveSearch(PathVar.getDbModule(), "database.js", {runFiles:true});

    }
}