import { FilesEngine } from "./common" ;


export class Module_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(FilesEngine.appRootPath, "module.js", {runFiles:true});

    }
}