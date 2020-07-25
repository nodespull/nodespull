"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npModule = void 0;
const server_1 = require("../../server");
const log_1 = require("../../etc/log");
class npModule {
    constructor(_name, _isModuleActive, _isModuleProtected, _importedModules) {
        this._name = _name;
        this._isModuleActive = _isModuleActive;
        this._isModuleProtected = _isModuleProtected;
        this._importedModules = _importedModules;
        this._route = {};
        this._service = {};
        // propagate importedModules' services to this module
        for (let module of Object.values(_importedModules))
            for (let serviceName of Object.keys(module._service))
                if (!Object.keys(this._service).includes(serviceName))
                    this._service[serviceName] = module._service[serviceName];
    }
    /**
     * forward http request to another route
     * @param {Request} req request object
     * @param {Response} res response object
     * example: forward(req, res).to(http.GET, "/home")
     */
    _forward(req, res) {
        return new npRouteForward(req, res, this);
    }
    //add a route to module
    _addAndLoadRoute(route) {
        // load route into nodespull module
        this._route[route.method.name + ":" + route.path] = route;
        // load route into nodespull router
        route.isRouteActive = route.isRouteActive != undefined ? route.isRouteActive : (this._isModuleActive != undefined ? this._isModuleActive : false);
        route.isRouteProtected = route.isRouteProtected != undefined ? route.isRouteProtected : (this._isModuleProtected != undefined ? this._isModuleProtected : true);
        if (route.method.name == "HEAD")
            server_1.http.HEAD(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path);
        if (route.method.name == "GET")
            server_1.http.GET(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path);
        if (route.method.name == "DELETE")
            server_1.http.DELETE(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path);
        if (route.method.name == "POST")
            server_1.http.POST(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path);
        if (route.method.name == "PUT")
            server_1.http.PUT(route.handler, route.isRouteActive, route.isRouteProtected, route.urlParams, route.path);
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
    // interface for user to access this module values
    getSelfObject() {
        return {
            name: this._name,
            imports: this._importedModules,
            forward: this._forward,
            service: this._service,
            route: this._route
        };
    }
}
exports.npModule = npModule;
class npRouteForward {
    constructor(req, res, module) {
        this.req = req;
        this.res = res;
        this.module = module;
    }
    /**
     * @param {Function} method http method of endpoint - from Router object
     * @param {String} path path of endpoint
     * example: forward(req, res).to(Router.GET, "/home")
     */
    to(method, path) {
        let route = this.module._route[method.name + ":" + path];
        if (!route && this.module._importedModules.length > 0)
            for (let module of this.module._importedModules)
                module._forward(this.req, this.res).to(method, path);
        else if (!route)
            new log_1.Log(`route forwarding: "${method.name}:${path}" not found"`).throwError();
        else
            route.handler(this.req, this.res);
    }
}
