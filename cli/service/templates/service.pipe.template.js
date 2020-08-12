"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTemplate(serviceVarName, moduleVarName) {
    if (moduleVarName.slice(-1 * "Module".length) != "Module")
        moduleVarName = moduleVarName.toLowerCase() + "Module";
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".mod";
    return `const { Database, npService } = require("@nodespull/core")
const { ${moduleVarName} } = require("../../${moduleFileName}")


const $ = npService({
    loader: ${moduleVarName},
    selector: "${serviceVarName}",
    bootstrap: false,
    default: null,
    functions: { forward, backward },
    fields: {}
})


/**
 * runs on forward pipe flow
 * @param {Request} req 
 * @param {Response} res 
 */
function forward(req, res, next, funcData) {
    next()
}


/**
 * runs on backward pipe flow
 * @param {Request} req 
 * @param {Response} res 
 * @param {Error} forwardException 
 */
function backward(req, res, next, forwardException) {
    next(forwardException)
}
`;
}
exports.default = getTemplate;
