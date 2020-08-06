import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"


export class Route_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.appModule, "delete.js", {runFiles:true});
        super.recursiveSearch(PathVar.appModule, "get.js", {runFiles:true});
        super.recursiveSearch(PathVar.appModule, "head.js", {runFiles:true});
        super.recursiveSearch(PathVar.appModule, "post.js", {runFiles:true});
        super.recursiveSearch(PathVar.appModule, "put.js", {runFiles:true});
    }
}