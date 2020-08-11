import { npJWT } from "../crypt/models/jwt";


export interface routeHandlerArg_interface {
    handler:Function, 
    isRouteActive:boolean, 
    urlParams:string[], 
    path:string, 
    jwtProfile:npJWT|null
}