import express from "express"
import {Application} from "express"
import { npJWT } from "../crypt/models/jwt";
import { npHttpInterfaceArg_interface } from "./model";
import { NpServer } from "../bootstrap";


export class npHttpInterface {
    // auth:Authentication;

    constructor(){
    }

    /**
     * For auto-generated routes
     */
    static HEAD(args: npHttpInterfaceArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        NpServer.expressApp.head(args.path+params,(req:any, res:any,)=>{
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
    static GET(args: npHttpInterfaceArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        NpServer.expressApp.get(args.path+params,(req:any, res:any,)=>{
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
    static POST(args: npHttpInterfaceArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        NpServer.expressApp.post(args.path+params,(req:any, res:any,)=>{
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
    static PUT(args: npHttpInterfaceArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        NpServer.expressApp.put(args.path+params,(req:any, res:any,)=>{
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
    static DELETE(args: npHttpInterfaceArg_interface){
        if(!args.isRouteActive) return;
        let params = "";
        if(args.urlParams[0]) for(let param of args.urlParams) params += "/:"+param;
        NpServer.expressApp.delete(args.path+params,(req:any, res:any,)=>{
            if(args.jwtProfile){
                args.jwtProfile.verifyToken(req,res,()=>{
                    args.handler(req,res);
                })
            } else args.handler(req, res);
        })
    }





}

