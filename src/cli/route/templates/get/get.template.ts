import { JSReservedWords } from "../../../../etc/js-reserved-words";
import { Log } from "../../../../etc/log";

export default function get(path:string, moduleVarName:string, locationDepth:number):string{
    let name = path.split("/").pop()// remove slash, get last
    name  = name!.split("-").join("_"); // remove dashes
    // if(JSReservedWords.getList().includes(name)) name = "_"+name // put underscore in front of js reserved words
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".mod"

    return `const { http, Database, npRoute, Pipe } = require("@nodespull/core")
const { hash, jwt, oauth2 } = require("@nodespull/core/crypt")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth)+moduleFileName}")



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
async function ${name}Handler(req, res) {
    
    res.send("get:${path} works")

}
`
}