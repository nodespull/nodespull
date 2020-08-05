import { JSReservedWords } from "../../../../etc/js-reserved-words";
import { Log } from "../../../../etc/log";

export default function post(path:string, moduleVarName:string, locationDepth:number):string{
    let name = path.split("/").pop()// remove slash, get last
    name  = name!.split("-").join("_"); // remove dashes
    if(JSReservedWords.getList().includes(name)) name = "_"+name // put underscore in front of js reserved words
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module"

    return `const { http, Database, npRoute, Pipe } = require("@nodespull/core")
const { Hash, Session } = require("@nodespull/core/utils")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth)+moduleFileName}")


const $ = npRoute({
    loader: ${moduleVarName},
    method: http.PUT,
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
    /** @type {json} */ let body = req.body;
    /* ------------------------------------------ */

    
    res.send("put:${path} works")


}
`
}