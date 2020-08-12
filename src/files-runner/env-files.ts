import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Env_FilesLoader extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.getProcessEnv(), "env.js", {runFiles:true});
        super.recursiveSearch(PathVar.getAppEnvModule(), "env.js", {runFiles:true});
    }
}