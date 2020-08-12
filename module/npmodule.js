"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npRouteForward = exports.npModule = void 0;
const server_1 = require("../server");
const log_1 = require("../etc/log");
class npModule {
    constructor(_name, _loadRoutes, _jwtProfile, _importedModules) {
        this._name = _name;
        this._loadRoutes = _loadRoutes;
        this._jwtProfile = _jwtProfile;
        this._importedModules = _importedModules;
        this._route = {};
        this._service = {};
        // propagate importedModules' services to this module
        for (let module of Object.values(_importedModules))
            for (let serviceName of Object.keys(module._service))
                if (!Object.keys(this._service).includes(serviceName))
                    this._service[serviceName] = module._service[serviceName];
    }
    //add a route to module
    _addAndLoadRoute(route) {
        // load route into nodespull module
        this._route[route.method.name + ":" + route.path] = route;
        // load route into nodespull router
        route.isRouteActive = route.isRouteActive != undefined ? route.isRouteActive : (this._loadRoutes != undefined ? this._loadRoutes : false);
        let routeArgs = {
            handler: route.handler,
            isRouteActive: route.isRouteActive,
            urlParams: route.urlParams,
            path: route.path,
            jwtProfile: route.jwtProfile || this._jwtProfile
        };
        if (route.method.name == "HEAD")
            server_1.http.HEAD(routeArgs);
        if (route.method.name == "GET")
            server_1.http.GET(routeArgs);
        if (route.method.name == "DELETE")
            server_1.http.DELETE(routeArgs);
        if (route.method.name == "POST")
            server_1.http.POST(routeArgs);
        if (route.method.name == "PUT")
            server_1.http.PUT(routeArgs);
    }
    //add a service to module
    _addService(service) {
        let val = {};
        // load functions and fields with function taking precedence
        if (service.fields)
            for (let fieldName of Object.keys(service.fields))
                val[fieldName] = service.fields[fieldName];
        if (service.functions) {
            for (let funcName of Object.keys(service.functions)) {
                if (!(service.functions[funcName] instanceof Function)) {
                    new log_1.Log(`element '${funcName}' in service '${this._name}' is not a function`).throwError();
                    process.exit(1);
                }
                val[funcName] = service.functions[funcName];
            }
        }
        val = service.default || val; // set value of service to default if exist
        if (service.bootstrap) { // selector returns promise(s) if bootstrap is true
            let jobRes;
            if (service.default)
                jobRes = this.__addService_selfBootCheck(service, service.default);
            else
                jobRes = this.__addService_selfBootCheck(service, service.functions);
            this._service[service.selector] = jobRes; // selector.func call returns a promise 
        }
        else
            this._service[service.selector] = val; // selector returns either default or funcs + fields
    }
    //helper func for __addService; runs self booted functions and returns Promise
    __addService_selfBootCheck(service, arg) {
        let res;
        if (arg instanceof Function) {
            res = service.default();
            if (res && !(res instanceof Promise)) {
                new log_1.Log(`self booted function '${service.selector}' has return value type other than 'Promise'`).throwError();
                process.exit(1);
            }
            return res;
        }
        res = {};
        if (service.functions) {
            for (let funcName of Object.keys(service.functions)) {
                if (!(service.functions[funcName] instanceof Function)) {
                    new log_1.Log(`element '${funcName}' in service '${service.selector}' is not a function`).throwError();
                    process.exit(1);
                }
                let funcRes = service.functions[funcName]();
                if (funcRes && !(funcRes instanceof Promise)) {
                    new log_1.Log(`self booted function '${funcName}' of service '${service.selector}' has return value type other than 'Promise'`).throwError();
                    process.exit(1);
                }
                res[funcName] = funcRes;
            }
        }
        return res;
    }
    get service() {
        // add imported services to local array with low priority
        for (let module of this._importedModules)
            for (let serviceName of Object.keys(module._service)) {
                if (!Object.keys(this._service).includes(serviceName))
                    this._service[serviceName] = module._service[serviceName];
            }
        return this._service;
    }
    // interface for user to access this module values
    getSelfObject() {
        return {
            name: this._name,
            imports: this._importedModules,
            forward: this.forward,
            service: this.service,
            route: this._route
        };
    }
    /**
     * forward http request to another route
     * @param {Request} req request object
     * @param {Response} res response object
     * @return {npRouteForward} routing object
     * example: ``` forward(req, res).to(http.GET, "/home")```
     */
    forward(req) {
        return new npRouteForward(req, {}, this);
    }
}
exports.npModule = npModule;
class npRouteForward {
    constructor(req, res, module) {
        this.req = req;
        this.res = res;
        this.module = module;
    }
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
    to(method, path) {
        return __awaiter(this, void 0, void 0, function* () {
            let promise = Promise.resolve([null, null]);
            let _useParent = false;
            let attemptParent = new Promise((resolve, reject) => {
                this.module.route = this.module.route || this.module._route;
                this.module.imports = this.module.imports || this.module._importedModules;
                let route = this.module.route[method.name + ":" + path];
                if (!route && this.module.imports.length > 0)
                    for (let module of this.module.imports) {
                        let attemptChild = module.forward(this.req, this.res).to(method, path);
                        if (attemptChild instanceof Promise)
                            promise = attemptChild;
                        break;
                    }
                //else if (!route) new Log(`route forwarding: "${this.method.name}:${this.path}" not found"`).throwError()
                else if (route) { // route found
                    _useParent = true;
                    // let clonedRes:any = cloneObject(this.res) // json, send functions are modified to return to original endpoint
                    // let status:number = clonedRes.status || 200
                    this.res["_status"] = 200;
                    this.res["status"] = (val) => { this.res["_status"] = val; return this.res; };
                    this.res["json"] = (data) => resolve([this.res["_status"], data]);
                    this.res["send"] = (str) => resolve([this.res["_status"], str]);
                    route.handler(this.req, this.res);
                }
            });
            if (_useParent)
                promise = attemptParent;
            return promise;
        });
    }
}
exports.npRouteForward = npRouteForward;
