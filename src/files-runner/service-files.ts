import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"


export class Service_FilesLoader extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.getAppModule(), "srv.js", {runFiles:true});
    }
}