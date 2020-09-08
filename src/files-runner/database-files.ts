import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"
import { DatabaseConnectionController } from "../database/connection";

export class Database_FilesLoader extends FilesEngine{
    static isLoaded:boolean = false
    static load(){
        if(Database_FilesLoader.isLoaded) return
        DatabaseConnectionController.connections = {} // reset connections before reloading
        new Database_FilesLoader()
        // Database_FilesLoader.isLoaded = true
    }
    constructor(){
        super()
        super.recursiveSearch(PathVar.getDbModule(), "link.js", {runFiles:true});

    }
}