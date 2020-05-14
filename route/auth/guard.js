"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_1 = require("./jwt");
const controller_1 = require("../controller");
class Authentication {
    constructor(app) {
        this._sys = app;
    }
    /**
     * Create a protected route for a head method socket. Example:
     * ```
     * $.head("/home", (req, res)=>{
     *     let data = req.session.someSavedData
     *     res.send("hello world")
     * })
     * ```
     */
    head(path, func) {
        this._sys.head(path, (req, res) => {
            jwt_1.JWT.checkToken(req, res, () => {
                func(req, res);
            });
        });
    }
    /**
     * Create a protected route for a get method socket. Example:
     * ```
     * $.get("/home", (req, res)=>{
     *     let data = req.session.someSavedData
     *     res.send("hello world")
     * })
     * ```
     */
    get(path, func) {
        this._sys.get(path, (req, res) => {
            jwt_1.JWT.checkToken(req, res, () => {
                func(req, res);
            });
        });
        if (path == "/" || path == "")
            controller_1.Route._home_set = true;
    }
    /**
     * Create a protected route for a post method socket. Example:
     * ```
     * $.post("/home", (req, res)=>{
     *     let data = req.session.someSavedData
     *     res.send("hello world")
     * })
     * ```
     */
    post(path, func) {
        this._sys.post(path, (req, res) => {
            jwt_1.JWT.checkToken(req, res, () => {
                func(req, res);
            });
        });
    }
    /**
     * Create a protected route for a put method socket. Example:
     * ```
     * $.put("/home", (req, res)=>{
     *     let data = req.session.someSavedData
     *     res.send("hello world")
     * })
     * ```
     */
    put(path, func) {
        this._sys.put(path, (req, res) => {
            jwt_1.JWT.checkToken(req, res, () => {
                func(req, res);
            });
        });
    }
    /**
     * Create a protected route for a delete method socket. Example:
     * ```
     * $.delete("/home", (req, res)=>{
     *     let data = req.session.someSavedData
     *     res.send("hello world")
     * })
     * ```
     */
    delete(path, func) {
        this._sys.delete(path, (req, res) => {
            jwt_1.JWT.checkToken(req, res, () => {
                func(req, res);
            });
        });
    }
}
exports.Authentication = Authentication;
