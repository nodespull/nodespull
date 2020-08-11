"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function get(path, moduleVarName, locationDepth) {
    let name = path.split("/").pop(); // remove slash, get last
    name = name.split("-").join("_"); // remove dashes
    // if(JSReservedWords.getList().includes(name)) name = "_"+name // put underscore in front of js reserved words
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".mod";
    return `const { http, Database, npRoute, Pipe } = require("@nodespull/core")
const { hash, jwt, oauth2 } = require("@nodespull/core/crypt")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth) + moduleFileName}")



const $ = npRoute({
    loader: ${moduleVarName},
    method: http.GET,
    handler: ${name}Handler,
    path: "${path}",
    urlParams: []
})

/**
 * @param {Request}  req request contains client data
 * @param {Response} res response contains http methods
 */
function ${name}Handler(req, res) {
    
    res.send("get:${path} works")

}
`;
}
exports.default = get;
