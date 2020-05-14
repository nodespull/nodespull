"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function put(path) {
    return `const {Router, Database} = require("nodespull")
const {Hash, Session} = require("nodespull/core/tools")
const {json} = require("nodespull/core/type/sys")


Router.PUT (
path = "${path}", 
isActive = false,
isProtected = false,
urlParams = [ undefined ], 

/**
 * @param {Request} req request contains client data
 * @param {Response} res response contains http methods
 */
function (req, res){
    /** @type {json} */ let client = req.session;
    /** @type {json} */ let params = req.params;
    /** @type {json} */ let query = req.query;
    /** @type {json} */ let body = req.body;
    /* ------------------------------------------ */

    res.status(200).send("put:${path} route is working");



})`;
}
exports.default = put;
