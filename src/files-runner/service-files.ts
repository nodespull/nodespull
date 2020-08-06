import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"


export class Service_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.appModule, "service.js", {runFiles:true});
    }
}