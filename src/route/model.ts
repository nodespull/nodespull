import { npJWT } from "../auth/models/jwt";


export interface routeHandlerArg_interface {
    handler:Function, 
    isRouteActive:boolean, 
    urlParams:string[], 
    path:string, 
    jwtProfile:npJWT|null
}