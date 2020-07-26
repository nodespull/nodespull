
export default function getTemplate(serviceVarName:string, moduleVarName:string):string{
    if(moduleVarName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module"
    return `const { Database, npService } = require("nodespull")
const { ${moduleVarName} } = require("../${moduleFileName}")


const $ = npService({
    loader: ${moduleVarName},
    selector: "${serviceVarName}",
    bootstrap: true,
    default: null,
    functions: {},
    fields: {}
})


/**
 * description
 * @param  {undefined} undefined no_description
 * @return {Promise|undefined}
 */
async function placeholder() {

}
`
}
