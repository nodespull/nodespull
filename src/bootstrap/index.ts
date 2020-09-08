import express from "express";
import { SwaggerController } from "../swagger/loader"
import bootconf_Message from "./bootconf/bootconf-message";
import bootconfStore from "./bootconf/bootconf-store"
import bodyParser from "body-parser"
import morgan from "morgan"
import { DatabaseConnectionController } from "../database/connection";
import { FilesLoader } from "../files-runner";
import { NpLifecycle } from "./bootconf/bootconf-lifecycle";
import { NpUserActionSwitch } from "./bootconf/bootconf-action-switch";
import { NpUserConfig } from "./bootconf/bootconf-user-config";



export class NpServer {

    static isExtension:boolean = false
    
    static expressApp:express.Application = express()
    
    // set basic configs to express app if first run
    static isExpressAppConfigured:boolean=false
    static ensureExpressAppConfigs(){
        if(NpServer.isExpressAppConfigured) return
        NpServer.expressApp.use(morgan("tiny"))
        NpServer.expressApp.use(bodyParser.json());
        NpServer.expressApp.use(bodyParser.urlencoded({ extended: true }));
        NpServer.isExpressAppConfigured = true
        setTimeout(() => {
            //delay while user rootfile is being parsed for homeroute injection
            if(!NpServer.isHomeRouteProvided && bootconfStore.server.IS_SWAGGER_ACTIVE)
            NpServer.expressApp.use("/",express.static(__dirname + '/../static'))
        }, 1000);
    }


    /**
     * starts express app listening
     */
    static listen(){
        SwaggerController.buildMaster()
        if(NpLifecycle.beforeServe) NpLifecycle.beforeServe()
        if(!NpUserConfig.isCorsPolicySet) bootconf_Message.cors.missing()
        NpServer.ensureExpressAppConfigs()
        bootconfStore.server.PORT = parseInt(process.env.PORT?process.env.PORT:"", 10) || bootconfStore.server.PORT
        if(!NpServer.isExtension)NpServer.expressApp.listen(bootconfStore.server.PORT, ()=>{
            bootconf_Message.express.serverStarted()
            if(NpLifecycle.afterServe) NpLifecycle.afterServe();
        });
    }


    /**
     * user completed configurations and is ready to lunch server
     * check for user actions and dispatch
     * NOTE: exposed directly to user
     */
    static userTriggeredAppLunch(){
        NpUserActionSwitch.dispatch()
    }


    /**
     * user action is serve
     * start connections to databases
     * configure and lunch express server along with np dependencies
     */
    static userRequestedServe(){
        for(let connSelector of Object.keys(DatabaseConnectionController.connections)) // establish links with remote database servers
            if(DatabaseConnectionController.connections[connSelector].conf.isActive) DatabaseConnectionController.connections[connSelector].start()
        NpServer.listen()
    }

    /**
     * allows user to set custom home route handler
     */
    static isHomeRouteProvided = false
    static setHomeRoute(func:Function){
        NpServer.expressApp.use("/",(req,res)=>{func(req,res)})
        NpServer.isHomeRouteProvided = true
    }

}