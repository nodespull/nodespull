import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Module_FilesLoader extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.appModule, "module.js", {runFiles:true});

    }
}