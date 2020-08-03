import { FilesEngine } from "./common" ;


export class Route_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(FilesEngine.appRootPath, "delete.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.appRootPath, "get.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.appRootPath, "head.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.appRootPath, "post.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.appRootPath, "put.js", {runFiles:true});
    }
}