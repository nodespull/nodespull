import { FilesEngine } from "./common" ;


export class Route_FilesRunner extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(FilesEngine.rootPath, "delete.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.rootPath, "get.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.rootPath, "head.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.rootPath, "post.js", {runFiles:true});
        super.recursiveSearch(FilesEngine.rootPath, "put.js", {runFiles:true});
    }
}