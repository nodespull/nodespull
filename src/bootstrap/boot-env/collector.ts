import { EnvType } from "./interfaces"
import { AppEnv } from "./store"
import { StringParser } from "../../etc/system-tools/string-validator"


export class EnvCollector {
    constructor(private envType:EnvType){}
    loadVars = (userTags:string[], varsMap: {[varName:string]:string})=>{
        let collectedVars:any = {}
        let flags = process.argv.filter(arg=>{if(arg.slice(0,2)=="--")return arg})
        let processTag:string|undefined = flags[0]
        if(processTag && userTags.includes(processTag)) for(let vName of Object.keys(varsMap)){ // any tags that match
            if(StringParser.isExtendedAlphaNum(vName)){
                collectedVars[vName] = String(varsMap[vName])
            }
        }
        else if(!processTag && userTags.length == 0) for(let vName of Object.keys(varsMap)){ // local
            if(StringParser.isExtendedAlphaNum(vName)){
                collectedVars[vName] = String(varsMap[vName])
            }
        }
        if(this.envType == EnvType.process) process.env = {...process.env, ...collectedVars}
        if(this.envType == EnvType.app) AppEnv.storedVars = {...AppEnv.storedVars, ...collectedVars}
    }
}