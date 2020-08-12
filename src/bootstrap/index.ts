import express from "express";
import swaggerLoader from "../templates/swagger/loader"
import bootconf_Message from "./bootconf/bootconf-message";
import bootconf_Store from "./bootconf/bootconf-store"
import bodyParser from "body-parser"
import morgan from "morgan"
import { DatabaseConnectionController } from "../database/connection";
import { FilesLoader } from "../files-runner";
import { NpLifecycle } from "./bootconf/bootconf-lifecycle";
import { NpUserActionSwitch } from "./bootconf/bootconf-action-switch";
import { NpUserConfig } from "./bootconf/bootconf-user-config";



export class NpServer {
    
    static expressApp:express.Application = express()
    
    // set basic configs to express app if first run
    static isExpressAppConfigured:boolean=false
    static ensureExpressAppConfigs(){
        if(NpServer.isExpressAppConfigured) return
        NpServer.expressApp.use(morgan("dev"))
        NpServer.expressApp.use(bodyParser.json());
        NpServer.expressApp.use(bodyParser.urlencoded({ extended: true }));
        swaggerLoader(NpServer.expressApp);
        NpServer.isExpressAppConfigured = true
        setTimeout(() => {
            //delay while user rootfile is being parsed for homeroute injection
            if(!NpServer.isHomeRouteProvided)
            NpServer.expressApp.use("/",express.static(__dirname + '/../public'))
        }, 1000);
    }


    /**
     * starts express app listening
     */
    static listen(){
        if(NpLifecycle.beforeServe) NpLifecycle.beforeServe()
        if(!NpUserConfig.isCorsPolicySet) bootconf_Message.cors.missing()
        NpServer.expressApp.listen( bootconf_Store.server.PORT, ()=>{
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