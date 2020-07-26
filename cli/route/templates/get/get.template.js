"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const js_reserved_words_1 = require("../../../../etc/js-reserved-words");
function get(path, moduleVarName, locationDepth) {
    let name = path.split("/").pop(); // remove slash, get last
    name = name.split("-").join("_"); // remove dashes
    if (js_reserved_words_1.JSReservedWords.getList().includes(name))
        name = "_" + name; // put underscore in front of js reserved words
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".module";
    return `const { http, Database, npRoute, Pipe } = require("nodespull")
const { Hash, Session } = require("nodespull/core/tools")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth) + moduleFileName}")


const $ = npRoute({
    loader: ${moduleVarName},
    method: http.GET,
    handler: ${name}Handler,
    path: "${path}",
    urlParams: ["uuid"],
    isRouteActive: undefined,
    isRouteProtected: undefined,
})

/**
 * @param {Request}  req request contains client data
 * @param {Response} res response contains http methods
 */
function ${name}Handler(req, res) {
    /** @type {json} */ let client = req.session;
    /** @type {json} */ let params = req.params;
    /** @type {json} */ let query = req.query;
    /* ------------------------------------------ */

    
    res.send("get:${path} works")


}
`;
}
exports.default = get;
