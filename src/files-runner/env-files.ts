import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Env_FilesLoader extends FilesEngine{
    static isLoaded:boolean = false
    static load(){
        if(Env_FilesLoader.isLoaded) return
        new Env_FilesLoader()
        // Env_FilesLoader.isLoaded = true
    }
    constructor(){
        super()
        super.recursiveSearch(PathVar.getProcessEnv(), "env.js", {runFiles:true});
        super.recursiveSearch(PathVar.getAppEnvModule(), "env.js", {runFiles:true});
    }
}