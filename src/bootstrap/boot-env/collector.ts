import { EnvType } from "./interfaces"
import { AppEnv } from "./store"
import { StringParser } from "../../etc/system-tools/string-validator"


export class EnvCollector {
    constructor(private envType:EnvType){}
    loadVars = (userTags:string[], varsMap: {[varName:string]:string})=>{
        let collectedVars:any = {}
        let excludedTags:string[] = ["--freeze", "--readonly"]
        let flags = process.argv.filter(arg=>{if(arg.slice(0,2)=="--" && !excludedTags.includes(arg))return arg})
        let envTag = process.argv.filter(arg=>{if(arg.slice(0,4)=="env=")return arg}).map(v=>{return "--"+v.slice(4)})[0] // e.g. env=prod -> --prod
        let processTag:string|undefined = envTag || flags[0]
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