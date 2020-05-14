import express from "express"
import {Application} from "express"
import {Authentication} from "./auth/guard"
import {JWT} from "./auth/jwt"

export class Route {
    private _sys: Application;
    auth:Authentication;
    static _home_set:boolean = false;

    constructor(app:Application){
        this.auth = new Authentication(app);
        this._sys = app;
    }
    /**
     * Create a route for a head method socket. Example:
     * ```
     * $.head("/home", (req, res)=>{
     *     res.send("hello world")
     * })
     * ```
     */
    head(path:string, func:Function){
        this._sys.head(path, (req,res)=>{
            func(req,res)
        })
    }
    /**
     * For auto-generated routes
     */
    HEAD(func:Function, isActive:boolean, isProtected:boolean, urlParams:string[], path:string){
        if(!isActive) return;
        let params = "";
        if(urlParams[0]) for(let param of urlParams) params += "/:"+param;
        this._sys.head(path+params,(req:any, res:any,)=>{
            if(isProtected){
                JWT.checkToken(req,res,()=>{
                    func(req,res);
                })
            } else func(req, res);
        })
    }

    /**
     * Create a route for a get method socket. Example:
     * ```
     * $.get("/home", (req, res)=>{
     *     res.send("hello world")
     * })
     * ```
     */
    get(path:string, func:Function){
        this._sys.get(path, (req,res)=>{
            func(req,res)
        })
        if(path == "/" || path=="") Route._home_set = true;
    }
    /**
     * For auto-generated routes
     */
    GET(func:Function, isActive:boolean, isProtected:boolean, urlParams:string[], path:string){
        if(!isActive) return;
        let params = "";
        if(urlParams[0]) for(let param of urlParams) params += "/:"+param;
        this._sys.get(path+params,(req:any, res:any,)=>{
            if(isProtected){
                JWT.checkToken(req,res,()=>{
                    func(req,res);
                })
            } else func(req, res);
        })
        if(path == "/" || path=="") Route._home_set = true;
    }

    /**
     * Create a route for a post method socket. Example:
     * ```
     * $.post("/home", (req, res)=>{
     *     res.send("hello world")
     * })
     * ```
     */
    post(path:string, func:Function){
        this._sys.post(path, (req,res)=>{
            func(req,res)
        })
    }
    /**
     * For auto-generated routes
     */
    POST(func:Function, isActive:boolean, isProtected:boolean, urlParams:string[], path:string){
        if(!isActive) return;
        let params = "";
        if(urlParams[0]) for(let param of urlParams) params += "/:"+param;
        this._sys.post(path+params,(req:any, res:any,)=>{
            if(isProtected){
                JWT.checkToken(req,res,()=>{
                    func(req,res);
                })
            } else func(req, res);
        })
    }

    /**
     * Create a route for a put method socket. Example:
     * ```
     * $.put("/home", (req, res)=>{
     *     res.send("hello world")
     * })
     * ```
     */
    put(path:string, func:Function){
        this._sys.put(path, (req,res)=>{
            func(req,res)
        })
    }
    /**
     * For auto-generated routes
     */
    PUT(func:Function, isActive:boolean, isProtected:boolean, urlParams:string[], path:string){
        if(!isActive) return;
        let params = "";
        if(urlParams[0]) for(let param of urlParams) params += "/:"+param;
        this._sys.put(path+params,(req:any, res:any,)=>{
            if(isProtected){
                JWT.checkToken(req,res,()=>{
                    func(req,res);
                })
            } else func(req, res);
        })
    }

    /**
     * Create a route for a delete method socket. Example:
     * ```
     * $.delete("/home", (req, res)=>{
     *     res.send("hello world")
     * })
     * ```
     */
    delete(path:string, func:Function){
        this._sys.delete(path, (req,res)=>{
            func(req,res)
        })
    }
    /**
     * For auto-generated routes
     */
    DELETE(func:Function, isActive:boolean, isProtected:boolean, urlParams:string[], path:string){
        if(!isActive) return;
        let params = "";
        if(urlParams[0]) for(let param of urlParams) params += "/:"+param;
        this._sys.delete(path+params,(req:any, res:any,)=>{
            if(isProtected){
                JWT.checkToken(req,res,()=>{
                    func(req,res);
                })
            } else func(req, res);
        })
    }





}

