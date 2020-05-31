"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
const guard_1 = require("./auth/guard");
const jwt_1 = require("./auth/jwt");
let Route = /** @class */ (() => {
    class Route {
        constructor(app) {
            this.auth = new guard_1.Authentication(app);
            this._sys = app;
        }
        /**
         * Create a route for a head method socket. Example:
         * ```
         * $.head("/home", (req, res)=>{
         *     res.send("hello world")
         * })
         * ```
         */
        head(path, func) {
            this._sys.head(path, (req, res) => {
                func(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        HEAD(func, isActive, isProtected, urlParams, path) {
            if (!isActive)
                return;
            let params = "";
            if (urlParams[0])
                for (let param of urlParams)
                    params += "/:" + param;
            this._sys.head(path + params, (req, res) => {
                if (isProtected) {
                    jwt_1.JWT.checkToken(req, res, () => {
                        func(req, res);
                    });
                }
                else
                    func(req, res);
            });
        }
        /**
         * Create a route for a get method socket. Example:
         * ```
         * $.get("/home", (req, res)=>{
         *     res.send("hello world")
         * })
         * ```
         */
        get(path, func) {
            this._sys.get(path, (req, res) => {
                func(req, res);
            });
            if (path == "/" || path == "")
                Route._home_set = true;
        }
        /**
         * For auto-generated routes
         */
        GET(func, isActive, isProtected, urlParams, path) {
            if (!isActive)
                return;
            let params = "";
            if (urlParams[0])
                for (let param of urlParams)
                    params += "/:" + param;
            this._sys.get(path + params, (req, res) => {
                if (isProtected) {
                    jwt_1.JWT.checkToken(req, res, () => {
                        func(req, res);
                    });
                }
                else
                    func(req, res);
            });
            if (path == "/" || path == "")
                Route._home_set = true;
        }
        /**
         * Create a route for a post method socket. Example:
         * ```
         * $.post("/home", (req, res)=>{
         *     res.send("hello world")
         * })
         * ```
         */
        post(path, func) {
            this._sys.post(path, (req, res) => {
                func(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        POST(func, isActive, isProtected, urlParams, path) {
            if (!isActive)
                return;
            let params = "";
            if (urlParams[0])
                for (let param of urlParams)
                    params += "/:" + param;
            this._sys.post(path + params, (req, res) => {
                if (isProtected) {
                    jwt_1.JWT.checkToken(req, res, () => {
                        func(req, res);
                    });
                }
                else
                    func(req, res);
            });
        }
        /**
         * Create a route for a put method socket. Example:
         * ```
         * $.put("/home", (req, res)=>{
         *     res.send("hello world")
         * })
         * ```
         */
        put(path, func) {
            this._sys.put(path, (req, res) => {
                func(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        PUT(func, isActive, isProtected, urlParams, path) {
            if (!isActive)
                return;
            let params = "";
            if (urlParams[0])
                for (let param of urlParams)
                    params += "/:" + param;
            this._sys.put(path + params, (req, res) => {
                if (isProtected) {
                    jwt_1.JWT.checkToken(req, res, () => {
                        func(req, res);
                    });
                }
                else
                    func(req, res);
            });
        }
        /**
         * Create a route for a delete method socket. Example:
         * ```
         * $.delete("/home", (req, res)=>{
         *     res.send("hello world")
         * })
         * ```
         */
        delete(path, func) {
            this._sys.delete(path, (req, res) => {
                func(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        DELETE(func, isActive, isProtected, urlParams, path) {
            if (!isActive)
                return;
            let params = "";
            if (urlParams[0])
                for (let param of urlParams)
                    params += "/:" + param;
            this._sys.delete(path + params, (req, res) => {
                if (isProtected) {
                    jwt_1.JWT.checkToken(req, res, () => {
                        func(req, res);
                    });
                }
                else
                    func(req, res);
            });
        }
    }
    Route._home_set = false;
    return Route;
})();
exports.Route = Route;
