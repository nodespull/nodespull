import {ModuleArgument_Route, ModuleArgument_PipeFunction, PipeFunction} from "./models"
import {Router} from "../server"
import { Route } from "../route/controller"
import {Log} from "../etc/log"

export class npModule {

    private routes: { [path:string]: ModuleArgument_Route } = {}
    private functions: {[name:string]: Function} = {}
    private pipeFunctions: {[name:string]: PipeFunction} = {}

    public isParentPlaceholder:boolean = false
    private isModuleActive:boolean|undefined = undefined
    private isModuleProtected:boolean|undefined = undefined

    constructor(public name:string, public parentModule:npModule|null, public childModules:npModule[]){        
        // configure parent and child modules
        parentModule?.addChildModules([this])
        if(parentModule){
            //propagate parent functions to this module
            for(let funcName of Object.keys(parentModule!.getFunctions())) if(!Object.keys(this.functions).includes(funcName))
                this.functions[funcName] = parentModule!.getFunction(funcName)
            //propagate parent routes to this module
            for(let routeKey of Object.keys(parentModule!.getRoutes())) if(!Object.keys(this.routes).includes(routeKey))
                this.routes[routeKey] = parentModule!.getRoute(routeKey)
            //propagate parent's isActive and isProtected status to this module
            if(parentModule.getIsModuleActive() != undefined) this.setIsModuleActive(parentModule.getIsModuleActive()!)
            if(parentModule.getIsModuleProtected() != undefined) this.setIsModuleProtected(parentModule.getIsModuleProtected()!)

        }
        for(let childModule of childModules){
            childModule.parentModule = this
            // propagate this functions to childModules
            for(let funcName of Object.keys(this.functions)) if(!Object.keys(childModule.getFunctions()).includes(funcName)) 
                childModule.addFunction(funcName,this.functions[funcName])
            // propagate this routes to childModules
            for(let routeKey of Object.keys(this.routes)) if(!Object.keys(childModule.getRoutes()).includes(routeKey)) childModule.addRoute(this.routes[routeKey])
            //propagate this isActive and isProtected status to childModules
            if(this.getIsModuleActive() != undefined) childModule.setIsModuleActive(this.getIsModuleActive()!)
            if(this.getIsModuleProtected() != undefined) childModule.setIsModuleProtected(this.getIsModuleProtected()!)
        }
    }

    /**
     * 
     * @param {Function} method http method of endpoint - from Router object
     * @param {String} path path of endpoint
     * @param {Request} req request object
     * @param {Response} res response object
     * example: reroute_to(Router.GET, "/home", req, res)
     */
    reroute_to(method:Function, path:string, req:Request, res:Response):void{
        let route = this.routes[method.name+":"+path]
        if(!route) new Log(`route "${method.name}:${path}" not found in module "${this.name}"`).throwError()
        else route.handler(req,res);
    }

    //getters
    getRoutes():{ [path:string]: ModuleArgument_Route }{
        return this.routes
    }
    getRoute(routeKey:string):ModuleArgument_Route{
        return this.routes[routeKey]
    }
    getIsModuleProtected():boolean|undefined{
        return this.isModuleProtected
    }

    addChildModules(childModules: npModule[]){
        this.childModules = [...this.childModules, ...childModules]
    }
    getFunctions():{[name:string]: Function}{
        return this.functions
    }
    getFunction(name:string):Function{
        return this.functions[name]
    }
    getPipeFunctions():{[name:string]: PipeFunction}{
        return this.pipeFunctions
    }
    getPipeFunction(name:string):PipeFunction{
        return this.pipeFunctions[name]
    }

    //setters
    addAndLoadRoute(route: ModuleArgument_Route){
        // load route into nodespull module
        this.routes[route.method.name+":"+route.path] = route
        // load route into nodespull router
        if(this.isModuleActive != undefined) route.isActive = this.isModuleActive!
        if(this.isModuleProtected != undefined) route.isProtected = this.isModuleProtected!
        if(route.method.name == "HEAD") Router.HEAD(route.handler,route.isActive,route.isProtected,route.urlParams,route.path)
        if(route.method.name == "GET") Router.GET(route.handler,route.isActive,route.isProtected,route.urlParams,route.path)
        if(route.method.name == "DELETE") Router.DELETE(route.handler,route.isActive,route.isProtected,route.urlParams,route.path)
        if(route.method.name == "POST") Router.POST(route.handler,route.isActive,route.isProtected,route.urlParams,route.path)
        if(route.method.name == "PUT") Router.PUT(route.handler,route.isActive,route.isProtected,route.urlParams,route.path)

    }
    addRoute(route: ModuleArgument_Route){
        this.routes[route.method.name+":"+route.path] = route
         //propagate new route to childModules
         for(let childModule of this.childModules) if(!Object.keys(childModule.getRoutes()).includes(route.method.name+":"+route.path))
         childModule.addRoute(route)
    }
    addFunction(name:string, definition: Function){
        //overwrite copies of parent functions if new def with same name
        this.functions[name] = definition
        //propagate new function to childModules
        for(let childModule of this.childModules) if(!Object.keys(childModule.getFunctions()).includes(name))
            childModule.addFunction(name,definition)
    }
    addPipeFunction(pipeFunction: ModuleArgument_PipeFunction){
        //overwrite copies of parent functions if new def with same name
        this.pipeFunctions[pipeFunction.name] = pipeFunction.flow
        //propagate new function to childModules
        for(let childModule of this.childModules) if(!Object.keys(childModule.getPipeFunctions()).includes(pipeFunction.name))
            childModule.addPipeFunction(pipeFunction)
    }
    setIsModuleActive(bool:boolean){
        this.isModuleActive = bool
        for(let childModule of this.childModules) childModule.setIsModuleActive(bool)
    }
    getIsModuleActive():boolean|undefined{
        return this.isModuleActive
    }
    setIsModuleProtected(bool:boolean){
        this.isModuleProtected = bool
        for(let childModule of this.childModules) childModule.setIsModuleProtected(bool)

    }

}