import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"


export class Service_FilesLoader extends FilesEngine{
    static isLoaded:boolean = false
    static load(){
        if(Service_FilesLoader.isLoaded) return
        new Service_FilesLoader()
        // Service_FilesLoader.isLoaded = true
    }
    constructor(){
        super()
        super.recursiveSearch(PathVar.getAppModule(), "srv.js", {runFiles:true});
    }
}