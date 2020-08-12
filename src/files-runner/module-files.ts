import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Module_FilesLoader extends FilesEngine{
    static isLoaded:boolean = false
    static load(){
        if(Module_FilesLoader.isLoaded) return
        new Module_FilesLoader()
        Module_FilesLoader.isLoaded = true
    }
    constructor(){
        super()
        super.recursiveSearch(PathVar.getAppModule(), "module.js", {runFiles:true});

    }
}