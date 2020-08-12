import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Auth_FilesLoader extends FilesEngine{

    static isLoaded:boolean = false
    static load(){
        if(Auth_FilesLoader.isLoaded) return
        new Auth_FilesLoader()
        Auth_FilesLoader.isLoaded = true
    }

    constructor(){
        super()
        super.recursiveSearch(PathVar.getSrc()+"/auth", "jwt.js", {runFiles:true});
        super.recursiveSearch(PathVar.getSrc()+"/auth", "oauth2.js", {runFiles:true});
    }
}