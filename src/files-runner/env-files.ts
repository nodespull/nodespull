import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Env_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.processEnv, "env.js", {runFiles:true});
        super.recursiveSearch(PathVar.appEnvModule, "env.js", {runFiles:true});
    }
}