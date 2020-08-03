import { FilesEngine } from "./common" ;


export class Service_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(FilesEngine.appRootPath, "service.js", {runFiles:true});
    }
}