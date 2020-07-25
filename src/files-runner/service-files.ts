import { FilesEngine } from "./common" ;


export class Service_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(FilesEngine.rootPath, "service.js", {runFiles:true});
    }
}