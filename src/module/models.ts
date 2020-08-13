import { npModule } from "./npmodule";
import { npJWT } from "../crypt/models/jwt";

export interface npModuleUserInterface { // interface for object returned to user
    readonly name: string,
    readonly imports: npModule[],
    readonly forward: Function,
    readonly service: { [name: string]: npServiceInterface }, //public
    readonly route: { [name: string]: npRouteInterface },
}

export interface npModuleArgInterface { // interface for arguments used to create module
    name: string,
    loadRoutes: boolean|undefined,
    jwtProfile: npJWT|null,
    useGuard: npJWT|null, //interchangeable with jwtProfile, value is eventually copied to it
    imports: npModule[]
}

export interface npModuleSelfObjectInterface {
    name: string,
    imports: npModule[],
    forward: Function,
    service: { [name: string]: any },
    route: { [selector: string]: npRouteInterface }
}

export interface npRouteInterface {
    loader: npModule,
    method: Function,
    handler: Function,
    path: string,
    urlParams: string[],
    isRouteActive: boolean|undefined,
    jwtProfile: null|npJWT
    useGuard: npJWT|null, //interchangeable with jwtProfile, value is eventually copied to it
}


export interface npServiceInterface {
    loader: npModule,
    selector: string,
    bootstrap: boolean,
    isCallable: boolean,
    default: any|undefined,
    functions: {[name:string]: Function}|undefined, //includes npServicePipeFunction
    fields: any|undefined
}

export interface npServicePipeFunction{
    forward: Function,
    backward: Function
}