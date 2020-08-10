import { StringParser } from "../etc/system-tools/string-validator"


export class EnvCollector {
    constructor(private envType:EnvType){}
    loadVars(userTags:string[], varsMap: {[varName:string]:string}){
        let collectedVars:any = {}
        let processTag:string|undefined = process.argv.join(" ").split("--").length==1?undefined:process.argv.join(" ").split("--").slice(-1)[0]
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



export class AppEnv {
    static storedVars = {}
}

export enum EnvType {
    process,
    app
}