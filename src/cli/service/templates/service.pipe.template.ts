
export default function getTemplate(serviceVarName:string, moduleVarName:string):string{
    if(moduleVarName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".mod"
    return `const { link, npService } = require("@nodespull/core")
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
 * @param {any} data
 */
async function forward(data, next) {
    next(data)
}


/**
 * runs on backward pipe flow
 * @param {any} data 
 * @param {any} error 
 */
async function backward(data, error, next) {
    next(data, error)
}
`
}
