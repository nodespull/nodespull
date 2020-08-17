
import {NpUserConfigServer_interface, NpUserConfigSecurity_interface} from "./interfaces"
import bootconfStore from "../bootconf-store"
import { NpServer } from "../.."
import { NpLifecycle } from "../bootconf-lifecycle"



export class NpUserConfig {

    static isCorsPolicySet:boolean = false // used at npBoot.listen to check that user set cors configs

    static server(args:NpUserConfigServer_interface){
        bootconfStore.server.PORT = Number(args.port) || bootconfStore.server.PORT
        bootconfStore.server.IS_SWAGGER_ACTIVE = args.useSwagger || bootconfStore.server.IS_SWAGGER_ACTIVE
    }
    static security(args:NpUserConfigSecurity_interface){
        if(args.cors)NpUserConfig_helper.setCorsPolicy(args.cors)
    }
    // lifecycle hooks
    static beforeServe = (func:Function)=>NpLifecycle.setBeforeServe(func)
    static afterServe = (func:Function)=>NpLifecycle.setAfterServe(func)


}

class NpUserConfig_helper{

    /**
     * set cores policy for express server
     */
    static setCorsPolicy(args:any[]){
        NpUserConfig.isCorsPolicySet = true;
        let origins: string[] = [];
        for(let arg of args) origins.push(arg["domain"]);
        NpServer.expressApp.use((req,res,next)=>{
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if(origins.includes("*")){
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", args[origins.indexOf("*")]["methods"].join(" "));
            }
            else if(origins.includes(req.headers.origin as string)){
                res.setHeader("Access-Control-Allow-Origin", req.headers.origin as string);
                res.setHeader("Access-Control-Allow-Methods", args[origins.indexOf(req.headers.origin as string)]["methods"].join(" "));
            }
            next()
        })
    }
}