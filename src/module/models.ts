import { npModule } from "./module";

export interface ModuleArgument {
    name?: string,
    source?: string,
    parent?: string,
    functions?: { [name:string]: Function },
    pipeFunction?: ModuleArgument_PipeFunction,
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

export interface ModuleArgument_PipeFunction {
    name: string,
    flow: {
        forward: Function,
        backward: Function
    }
}

export interface Module_CallableInstanceResponse {
    func: {[name:string]: Function},
    pipefunc: {[name:string]: {forward:Function, backward:Function}},
    scope: npModule
}

