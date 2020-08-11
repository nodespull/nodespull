import { FilesEngine } from "./common" ;
import { PathVar } from "../etc/other/paths"

export class Auth_FilesLoader extends FilesEngine{
    constructor(){
        super()
        super.recursiveSearch(PathVar.src+"/auth", "jwt.js", {runFiles:true});
        super.recursiveSearch(PathVar.src+"/auth", "oauth2.js", {runFiles:true});
    }
}