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
    functions: {},
    fields: {}
})


/**
 * description
 * @param  {undefined} undefined no_description
 * @return {undefined}
 */
function placeholder() {

}
`;
}
exports.default = getTemplate;
