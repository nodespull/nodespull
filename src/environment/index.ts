import { StringParser } from "../etc/system-tools/string-validator"


export class ProcessEnv {
    constructor(){}

    loadVars(tags:string[], vars: {[varName:string]:string}):void{
        let processTag:string|undefined = process.argv.join(" ").split("--").slice(-1).length==1?undefined:process.argv.join(" ").split("--").slice(-1)[0]
        if(processTag && tags.includes(processTag)) for(let vName of Object.keys(vars)){
            if(StringParser.isExtendedAlphaNum(vName)){
                process.env[vName] = String(vars[vName])
            }
        }
        else if(!processTag && tags.length == 0) for(let vName of Object.keys(vars)){
            if(StringParser.isExtendedAlphaNum(vName)){
                process.env[vName] = String(vars[vName])
            }
        }
    }

}


export class AppEnv {

    var: {[varName:string]:string} = {}

    constructor(){}

    loadVars(tags:string[], vars: {[varName:string]:string}):void{
        let processTag:string|undefined = process.argv.join(" ").split("--").slice(-1).length==1?undefined:process.argv.join(" ").split("--").slice(-1)[0]
        if(processTag && tags.includes(processTag)) for(let vName of Object.keys(vars)){
            if(StringParser.isExtendedAlphaNum(vName)){
                this.var[vName] = String(vars[vName])
            }
        }
        else if(!processTag && tags.length == 0) for(let vName of Object.keys(vars)){
            if(StringParser.isExtendedAlphaNum(vName)){
                this.var[vName] = String(vars[vName])
            }
        }
    }
}