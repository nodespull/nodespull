import { npServiceInterface, npModuleUserInterface, npRouteInterface, npModuleSelfObjectInterface } from "./models"
import { http } from "../entrypoint"
import { Log } from "../etc/log"
import { npJWT } from "../crypt/models/jwt"
import { npHttpInterfaceArg_interface } from "../http/model"

export class npModule {
    public _route: { [selector: string]: npRouteInterface } = {}
    public _service: { [name: string]: any } = {}

    constructor(
        public _name: string,
        public _loadRoutes: boolean | undefined,
        public _jwtProfile: npJWT | null,
        public _importedModules: npModule[]) {
            // propagate importedModules' services to this module
            for(let module of Object.values(_importedModules)) 
                for(let serviceName of Object.keys(module._service))
                    if(!Object.keys(this._service).includes(serviceName)) 
                        this._service[serviceName] = module._service[serviceName]
        }


    //add a route to module
    _addAndLoadRoute(route: npRouteInterface) {
        // load route into nodespull module
        this._route[route.method.name + ":" + route.path] = route
        // load route into nodespull router
        route.isRouteActive = route.isRouteActive!=undefined?route.isRouteActive:(this._loadRoutes!=undefined?this._loadRoutes:false)
        let routeArgs: npHttpInterfaceArg_interface = {
            handler: route.handler, 
            isRouteActive: route.isRouteActive, 
            urlParams: route.urlParams, 
            path: route.path, 
            jwtProfile: route.jwtProfile || this._jwtProfile
        }
        if (route.method.name == "HEAD") http.HEAD(routeArgs)
        if (route.method.name == "GET") http.GET(routeArgs)
        if (route.method.name == "DELETE") http.DELETE(routeArgs)
        if (route.method.name == "POST") http.POST(routeArgs)
        if (route.method.name == "PUT") http.PUT(routeArgs)
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

    get service(){
        // add imported services to local array with low priority
        for(let module of this._importedModules) for(let serviceName of Object.keys(module._service)){
            if(!Object.keys(this._service).includes(serviceName)) this._service[serviceName] = module._service[serviceName]
        }
        return this._service
    }

    // interface for user to access this module values
    getSelfObject():npModuleUserInterface{
        return {
            name: this._name,
            imports: this._importedModules,
            forward: this.forward,
            service: this.service,
            route: this._route
        }
    }

    /**
     * forward http request to another route
     * @param {Request} req request object
     * @param {Response} res response object
     * @return {npRouteForward} routing object
     * example: ``` forward(req, res).to(http.GET, "/home")```
     */
    forward(req: Request):npRouteForward{
        return new npRouteForward(req, {}, this)
    }

}


export class npRouteForward {
    constructor(private req:Request, private res:any, private module:any){}
    // module type will be npModuleSelfObjectInterface

    /**
     * @param {Function} method http method of endpoint - from Router object
     * @param {String} path path of endpoint
     * @param {Function} callback handles response from endpoint
     * ```
     * example: forward(req, res).to(Router.GET, "/home", (status, data)=> {
     *      res.status(status).send(data)
     * })
     * ```
     */
    async to(method: Function, path: string):Promise<Array<any|null>>{ 
        let promise:Promise<Array<any|null>> = Promise.resolve([null,null])
        let _useParent = false;
        let attemptParent:Promise<any[]> = new Promise((resolve, reject) => {
            this.module.route = this.module.route || this.module._route
            this.module.imports = this.module.imports || this.module._importedModules
            let route = this.module.route[method.name + ":" + path]

            if(!route && this.module.imports.length > 0) 
                for(let module of this.module.imports) {
                    let attemptChild = module.forward(this.req,this.res).to(method,path)
                    if(attemptChild instanceof Promise) promise = attemptChild
                    break
                }
            //else if (!route) new Log(`route forwarding: "${this.method.name}:${this.path}" not found"`).throwError()
            else if(route){ // route found
                _useParent = true
                // let clonedRes:any = cloneObject(this.res) // json, send functions are modified to return to original endpoint
                // let status:number = clonedRes.status || 200
                this.res["_status"] = 200
                this.res["status"] = (val:number)=>{this.res["_status"] = val; return this.res}
                this.res["json"] = (data:any)=>resolve([this.res["_status"], data])
                this.res["send"] = (str:string)=>resolve([this.res["_status"], str])
                route.handler(this.req, this.res);
            }
        })
        if(_useParent) promise = attemptParent 
        return promise
    }

 
}
