
// import {Application} from "express"
// import {JWT} from "./jwt"
// import {Route} from "../controller"

// export class Authentication{
//     private _sys:Application;

//     constructor(app:Application){
//         this._sys = app;
//     }
//     /**
//      * Create a protected route for a head method socket. Example:
//      * ```
//      * $.head("/home", (req, res)=>{
//      *     let data = req.session.someSavedData
//      *     res.send("hello world")
//      * })
//      * ```
//      */
//     head(path:string, func:Function){
//         this._sys.head(path,(req:any, res:any,)=>{
//             JWT.checkToken(req,res,()=>{
//                 func(req,res);
//             })
//         })
//     }

//     /**
//      * Create a protected route for a get method socket. Example:
//      * ```
//      * $.get("/home", (req, res)=>{
//      *     let data = req.session.someSavedData
//      *     res.send("hello world")
//      * })
//      * ```
//      */
//     get(path:string, func:Function){
//         this._sys.get(path,(req:any, res:any,)=>{
//             JWT.checkToken(req,res,()=>{
//                 func(req,res);
//             })
//         })
//         if(path == "/" || path=="") Route._home_set = true;
//     }

//     /**
//      * Create a protected route for a post method socket. Example:
//      * ```
//      * $.post("/home", (req, res)=>{
//      *     let data = req.session.someSavedData
//      *     res.send("hello world")
//      * })
//      * ```
//      */
//     post(path:string, func:Function){
//         this._sys.post(path,(req:any, res:any,)=>{
//             JWT.checkToken(req,res,()=>{
//                 func(req,res);
//             })
//         })
//     }

//     /**
//      * Create a protected route for a put method socket. Example:
//      * ```
//      * $.put("/home", (req, res)=>{
//      *     let data = req.session.someSavedData
//      *     res.send("hello world")
//      * })
//      * ```
//      */
//     put(path:string, func:Function){
//         this._sys.put(path,(req:any, res:any,)=>{
//             JWT.checkToken(req,res,()=>{
//                 func(req,res);
//             })
//         })
//     }

//     /**
//      * Create a protected route for a delete method socket. Example:
//      * ```
//      * $.delete("/home", (req, res)=>{
//      *     let data = req.session.someSavedData
//      *     res.send("hello world")
//      * })
//      * ```
//      */
//     delete(path:string, func:Function){
//         this._sys.delete(path,(req:any, res:any,)=>{
//             JWT.checkToken(req,res,()=>{
//                 func(req,res);
//             })
//         })
//     }


// }

