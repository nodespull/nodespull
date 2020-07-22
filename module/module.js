"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npModule = void 0;
const server_1 = require("../server");
const log_1 = require("../etc/log");
class npModule {
    constructor(name, parentModule, childModules) {
        this.name = name;
        this.parentModule = parentModule;
        this.childModules = childModules;
        this.routes = {};
        this.functions = {};
        this.pipeFunctions = {};
        this.isParentPlaceholder = false;
        this.isModuleActive = undefined;
        this.isModuleProtected = undefined;
        // configure parent and child modules
        parentModule === null || parentModule === void 0 ? void 0 : parentModule.addChildModules([this]);
        if (parentModule) {
            //propagate parent functions to this module
            for (let funcName of Object.keys(parentModule.getFunctions()))
                if (!Object.keys(this.functions).includes(funcName))
                    this.functions[funcName] = parentModule.getFunction(funcName);
            //propagate parent routes to this module
            for (let routeKey of Object.keys(parentModule.getRoutes()))
                if (!Object.keys(this.routes).includes(routeKey))
                    this.routes[routeKey] = parentModule.getRoute(routeKey);
            //propagate parent's isActive and isProtected status to this module
            if (parentModule.getIsModuleActive() != undefined)
                this.setIsModuleActive(parentModule.getIsModuleActive());
            if (parentModule.getIsModuleProtected() != undefined)
                this.setIsModuleProtected(parentModule.getIsModuleProtected());
        }
        for (let childModule of childModules) {
            childModule.parentModule = this;
            // propagate this functions to childModules
            for (let funcName of Object.keys(this.functions))
                if (!Object.keys(childModule.getFunctions()).includes(funcName))
                    childModule.addFunction(funcName, this.functions[funcName]);
            // propagate this routes to childModules
            for (let routeKey of Object.keys(this.routes))
                if (!Object.keys(childModule.getRoutes()).includes(routeKey))
                    childModule.addRoute(this.routes[routeKey]);
            //propagate this isActive and isProtected status to childModules
            if (this.getIsModuleActive() != undefined)
                childModule.setIsModuleActive(this.getIsModuleActive());
            if (this.getIsModuleProtected() != undefined)
                childModule.setIsModuleProtected(this.getIsModuleProtected());
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
    reroute_to(method, path, req, res) {
        let route = this.routes[method.name + ":" + path];
        if (!route)
            new log_1.Log(`route "${method.name}:${path}" not found in module "${this.name}"`).throwError();
        else
            route.handler(req, res);
    }
    //getters
    getRoutes() {
        return this.routes;
    }
    getRoute(routeKey) {
        return this.routes[routeKey];
    }
    getIsModuleProtected() {
        return this.isModuleProtected;
    }
    addChildModules(childModules) {
        this.childModules = [...this.childModules, ...childModules];
    }
    getFunctions() {
        return this.functions;
    }
    getFunction(name) {
        return this.functions[name];
    }
    getPipeFunctions() {
        return this.pipeFunctions;
    }
    getPipeFunction(name) {
        return this.pipeFunctions[name];
    }
    //setters
    addAndLoadRoute(route) {
        // load route into nodespull module
        this.routes[route.method.name + ":" + route.path] = route;
        // load route into nodespull router
        if (this.isModuleActive != undefined)
            route.isActive = this.isModuleActive;
        if (this.isModuleProtected != undefined)
            route.isProtected = this.isModuleProtected;
        if (route.method.name == "HEAD")
            server_1.Router.HEAD(route.handler, route.isActive, route.isProtected, route.urlParams, route.path);
        if (route.method.name == "GET")
            server_1.Router.GET(route.handler, route.isActive, route.isProtected, route.urlParams, route.path);
        if (route.method.name == "DELETE")
            server_1.Router.DELETE(route.handler, route.isActive, route.isProtected, route.urlParams, route.path);
        if (route.method.name == "POST")
            server_1.Router.POST(route.handler, route.isActive, route.isProtected, route.urlParams, route.path);
        if (route.method.name == "PUT")
            server_1.Router.PUT(route.handler, route.isActive, route.isProtected, route.urlParams, route.path);
    }
    addRoute(route) {
        this.routes[route.method.name + ":" + route.path] = route;
        //propagate new route to childModules
        for (let childModule of this.childModules)
            if (!Object.keys(childModule.getRoutes()).includes(route.method.name + ":" + route.path))
                childModule.addRoute(route);
    }
    addFunction(name, definition) {
        //overwrite copies of parent functions if new def with same name
        this.functions[name] = definition;
        //propagate new function to childModules
        for (let childModule of this.childModules)
            if (!Object.keys(childModule.getFunctions()).includes(name))
                childModule.addFunction(name, definition);
    }
    addPipeFunction(pipeFunction) {
        //overwrite copies of parent functions if new def with same name
        this.pipeFunctions[pipeFunction.name] = pipeFunction.flow;
        //propagate new function to childModules
        for (let childModule of this.childModules)
            if (!Object.keys(childModule.getPipeFunctions()).includes(pipeFunction.name))
                childModule.addPipeFunction(pipeFunction);
    }
    setIsModuleActive(bool) {
        this.isModuleActive = bool;
        for (let childModule of this.childModules)
            childModule.setIsModuleActive(bool);
    }
    getIsModuleActive() {
        return this.isModuleActive;
    }
    setIsModuleProtected(bool) {
        this.isModuleProtected = bool;
        for (let childModule of this.childModules)
            childModule.setIsModuleProtected(bool);
    }
}
exports.npModule = npModule;
