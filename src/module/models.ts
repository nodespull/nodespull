import { npModule } from "./module";

export interface ModuleArgument {
    name?: string,
    source?: string,
    parent?: string,
    functions?: { [name:string]: Function }
    route?: ModuleArgument_Route,
    isModuleActive?: boolean|undefined,
    isModuleProtected?: boolean|undefined
}

export interface ModuleArgument_Route {
    method: Function
    isActive: boolean,
    isProtected: boolean,
    urlParams: string[],
    path: string,
    handler: Function,
}

export interface Module_CallableInstanceResponse {
    func: {[name:string]: Function},
    scope: npModule
}