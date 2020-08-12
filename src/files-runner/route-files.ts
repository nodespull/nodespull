import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"


export class RestRoute_FilesLoader extends FilesEngine{
    static isLoaded:boolean = false
    static load(){
        if(RestRoute_FilesLoader.isLoaded) return
        new RestRoute_FilesLoader()
        RestRoute_FilesLoader.isLoaded = true
    }
    constructor(){
        super()
        super.recursiveSearch(PathVar.getAppModule(), "delete.js", {runFiles:true});
        super.recursiveSearch(PathVar.getAppModule(), "get.js", {runFiles:true});
        super.recursiveSearch(PathVar.getAppModule(), "head.js", {runFiles:true});
        super.recursiveSearch(PathVar.getAppModule(), "post.js", {runFiles:true});
        super.recursiveSearch(PathVar.getAppModule(), "put.js", {runFiles:true});
    }
}