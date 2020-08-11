import {cmd} from "../exe/exe.log"
import fs from "fs"
import {PathVar} from "../../etc/other/paths"
import getJwtTemplate from "./templates/jwt.template"
import getOauth2Template from "./templates/oauth2.template"
import { StringParser } from "../../etc/system-tools/string-validator"
import { Log } from "../../etc/log"
import { error } from ".."


export async function newAuthProfile(args:string[]){
    let profileType:string = args[0]
    let name:string = args[1]
    if(!profileType || !name) throw error.wrongUsage
    name = StringParser.convertToExtendedAlphaNum_orThrow(name)!
    if(profileType == "--jwt") newJWTAuthProfile(name)
    else if(profileType == "--oauth2") newOauth2AuthProfile(name)
    else throw new Log("ERR: auth profile type not recognized").FgRed().getValue()
}


function newJWTAuthProfile(name:string){
    let path = PathVar.src+"/auth/jwt/"+name+".jwt.js"
    cmd("touch",[path]); // create module file
    fs.writeFile(path, getJwtTemplate(name),()=>{}) // populate module file with template
}

function newOauth2AuthProfile(name:string){
    let path = PathVar.src+"/auth/oauth2/"+name+".oauth2.js"
    cmd("touch",[path]); // create module file
    fs.writeFile(path, getOauth2Template(name),()=>{}) // populate module file with template
}