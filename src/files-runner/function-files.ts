import { FilesEngine } from "./common" ;


export class Function_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(FilesEngine.rootPath, "func.js", {runFiles:true});
    }
}