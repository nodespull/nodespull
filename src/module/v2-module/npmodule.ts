import { npServiceInterface, npModuleUserInterface, npRouteInterface } from "./models"
import { http } from "../../server"
import { Log } from "../../etc/log"

export class npModule {
    public _route: { [selector: string]: npRouteInterface } = {}
    public _service: { [name: string]: any } = {}

    constructor(
        public _name: string,
        public _isModuleActive: boolean | undefined,
        public _isModuleProtected: boolean | undefined,
        public _importedModules: npModule[]) {
            // propagate importedModules' services to this module
            for(let module of Object.values(_importedModules)) 
                for(let serviceName of Object.keys(module._service))
                    if(!Object.keys(this._service).includes(serviceName)) 
                        this._service[serviceName] = module._service[serviceName]
        }

    /**
     * forward http request to another route
     * @param {Request} req request object
     * @param {Response} res response object
     * example: forward(req, res).to(http.GET, "/home")
     */
    _forward(req: Request, res: Response):npRouteForward{
        return new npRouteForward(req, res, this)
    }


    //add a route to module
    _addAndLoadRoute(route: npRouteInterface) {
        // load route into nodespull module
        this._route[route.method.name + ":" + route.path] = route
        // load route into nodespull router
        route.isRouteActive = route.isRouteActive!=undefined?route.isRouteActive:(this._isModuleActive!=undefined?this._isModuleActive:false)
        route.isRouteProtected = route.isRouteProtected!=undefined?route.isRouteProtected:(this._isModuleProtected!=undefined?this._isModuleProtected:true)
        
        if (route.method.name == "HEAD") http.HEAD(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path)
        if (route.method.name == "GET") http.GET(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path)
        if (route.method.name == "DELETE") http.DELETE(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path)
        if (route.method.name == "POST") http.POST(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path)
        if (route.method.name == "PUT") http.PUT(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path)
    }

    //add a service to module
    _addService(service: npServiceInterface){
        let val:any = {}
        // load functions and fields with function taking precedence
        if(service.fields)
            for(let fieldName of Object.keys(service.fields)) val[fieldName] = service.fields[fieldName]
        if(service.functions){
            for(let funcName of Object.keys(service.functions)){
                if(!(service.functions[funcName] instanceof Function)) {
                    new Log(`element '${funcName}' in service '${this._name}' is not a function`).throwError()
                    process.exit(1)
                }
                val[funcName] = service.functions[funcName]
            }
        }
        val = service.default || val // set value of service to default if exist
        if(service.bootstrap){ // selector returns promise(s) if bootstrap is true
            let jobRes:Promise<any>|{[name:string]:Promise<any>}
            if(service.default) jobRes = this.__addService_selfBootCheck(service, service.default)
            else jobRes = this.__addService_selfBootCheck(service, service.functions)
            this._service[service.selector] = jobRes // selector.func call returns a promise 
        }
        else this._service[service.selector] = val // selector returns either default or funcs + fields
    }


    //helper func for __addService; runs self booted functions and returns Promise
    __addService_selfBootCheck(service:npServiceInterface, arg:any):Promise<any>|{[name:string]:Promise<any>}{
        let res
        if(arg instanceof Function){
            res = service.default()
            if(res && !(res instanceof Promise)){
                new Log(`self booted function '${service.selector}' has return value type other than 'Promise'`).throwError()
                process.exit(1)
            }
            return res as Promise<any>
        }
        res = {} as {[name:string]:Promise<any>}
        if(service.functions){
            for(let funcName of Object.keys(service.functions)){
                if(!(service.functions[funcName] instanceof Function)) {
                    new Log(`element '${funcName}' in service '${service.selector}' is not a function`).throwError()
                    process.exit(1)
                }
                let funcRes = service.functions[funcName]()
                if(funcRes && !(funcRes instanceof Promise)){
                    new Log(`self booted function '${funcName}' of service '${service.selector}' has return value type other than 'Promise'`).throwError()
                    process.exit(1)
                }
                res[funcName] = funcRes
            }
        }
        return res
    }

    // interface for user to access this module values
    getSelfObject():npModuleUserInterface{
        return {
            name: this._name,
            imports: this._importedModules,
            forward: this._forward,
            service: this._service,
            route: this._route
        }
    }

}


class npRouteForward {
    constructor(private req:Request, private res:Response, private module:npModule){}

    /**
     * @param {Function} method http method of endpoint - from Router object
     * @param {String} path path of endpoint
     * example: forward(req, res).to(Router.GET, "/home")
     */
    to(method: Function, path: string): void {
        let route = this.module._route[method.name + ":" + path]
        if(!route && this.module._importedModules.length > 0) 
            for(let module of this.module._importedModules) module._forward(this.req,this.res).to(method,path)
        else if (!route) new Log(`route forwarding: "${method.name}:${path}" not found"`).throwError()
        else route.handler(this.req, this.res);
    }
}
