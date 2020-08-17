
export default function getTemplate(serviceVarName:string, moduleVarName:string):string{
    if(moduleVarName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".mod"
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
 * @param {Object} data
 */
function forward(data, next) {
    next()
}


/**
 * runs on backward pipe flow
 * @param {Object} data 
 * @param {Error} forwardException 
 */
function backward(data, next, forwardException) {
    next(forwardException)
}
`
}
