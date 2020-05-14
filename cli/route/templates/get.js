"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get(path) {
    return `const {Router, Database} = require("nodespull")
const {Hash, Session} = require("nodespull/core/tools")
const {json} = require("nodespull/core/type/sys")


Router.GET ( 
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
    /* ------------------------------------------ */

    res.status(200).send("get:${path} route is working");



})`;
}
exports.default = get;
