import express from "express"
import {Application} from "express"
import { npJWT } from "../auth/models/jwt";
import { routeHandlerArg_interface } from "./model";


export class Route {
    // auth:Authentication;
    static is_homePath_fromUser:boolean = false;

    constructor(private app:Application){}

    /**
     * For auto-generated routes
     */
    HEAD(args: routeHandlerArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        this.app.head(args.path+params,(req:any, res:any,)=>{
            if(args.jwtProfile){
                args.jwtProfile.verifyToken(req,res,()=>{
                    args.handler(req,res);
                })
            } else args.handler(req, res);
        })
    }


    /**
     * For auto-generated routes
     */
    GET(args: routeHandlerArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        this.app.get(args.path+params,(req:any, res:any,)=>{
            if(args.jwtProfile){
                args.jwtProfile.verifyToken(req,res,()=>{
                    args.handler(req,res);
                })
            } else args.handler(req, res);
        })
        if(args.path == "/" || args.path=="") Route.is_homePath_fromUser = true;
    }


    /**
     * For auto-generated routes
     */
    POST(args: routeHandlerArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        this.app.post(args.path+params,(req:any, res:any,)=>{
            if(args.jwtProfile){
                args.jwtProfile.verifyToken(req,res,()=>{
                    args.handler(req,res);
                })
            } else args.handler(req, res);
        })
    }


    /**
     * For auto-generated routes
     */
    PUT(args: routeHandlerArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        this.app.put(args.path+params,(req:any, res:any,)=>{
            if(args.jwtProfile){
                args.jwtProfile.verifyToken(req,res,()=>{
                    args.handler(req,res);
                })
            } else args.handler(req, res);
        })
    }


    /**
     * For auto-generated routes
     */
    DELETE(args: routeHandlerArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        this.app.delete(args.path+params,(req:any, res:any,)=>{
            if(args.jwtProfile){
                args.jwtProfile.verifyToken(req,res,()=>{
                    args.handler(req,res);
                })
            } else args.handler(req, res);
        })
    }





}

