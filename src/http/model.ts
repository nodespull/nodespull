import { npJWT } from "../crypt/models/jwt";


export interface npHttpInterfaceArg_interface {
    handler:Function, 
    isRouteActive:boolean, 
    urlParams:string[], 
    path:string, 
    jwtProfile:npJWT|null
}