import { StringParser } from "../etc/system-tools/string-validator"


export class ProcessEnv {
    constructor(){}

    loadVars(tags:string[], vars: {[varName:string]:string}):void{
        if(tags.includes(process.argv.join(" ").split("--").slice(-1)[0])) for(let vName of Object.keys(vars)){
            if(StringParser.isExtendedAlphaNum(vName)){
                process.env[vName] = String(vars[vName])
            }
        }
    }

}


export class AppEnv {

    static var: {[varName:string]:string} = {}

    constructor(){}

    loadVars(tags:string[], vars: {[varName:string]:string}):void{
        if(tags.includes(process.argv.join(" ").split("--").slice(-1)[0])) for(let vName of Object.keys(vars)){
            if(StringParser.isExtendedAlphaNum(vName)){
                AppEnv.var[vName] = String(vars[vName])
            }
        }
    }
}