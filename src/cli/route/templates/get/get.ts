
export default function get(path:string):string{
    let name = path.split("/").pop()// remove slash, get last
    name  = "_"+name!.split("-").join("_");

    return `exports.ctr = ${name};
const {Router, Database} = require("nodespull")
const {Hash, Session} = require("nodespull/core/tools")
const {json} = require("nodespull/core/type/sys")


Router.GET ( ${name},
isActive = false,
isProtected = true,
urlParams = [ "id" ],
path = "${path}")


/**
 * @param {Request} req request contains client data
 * @param {Response} res response contains http methods
 */
function ${name}(req, res){
    /** @type {json} */ let client = req.session;
    /** @type {json} */ let params = req.params;
    /** @type {json} */ let query = req.query;
    /* ------------------------------------------ */

    res.status(200).send("get:${path} works")

    
    

}

`
}