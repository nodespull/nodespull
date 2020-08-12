"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTemplate(serviceVarName, moduleVarName) {
    if (moduleVarName.slice(-1 * "Module".length) != "Module")
        moduleVarName = moduleVarName.toLowerCase() + "Module";
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".mod";
    return `const { Database, npService, socketIO } = require("@nodespull/core")
const { ${moduleVarName} } = require("../../${moduleFileName}")


const $ = npService({
    loader: ${moduleVarName},
    selector: "${serviceVarName}",
    bootstrap: true,
    fields: {
        instance: socketIO("/socket/${serviceVarName}"),
        numClients: 0
    }
})


/**
 * description
 */
$.service.${serviceVarName}.instance.on("connection", (socket) => {
    $.service.${serviceVarName}.numClients++

    socket.on("event", (data) => {

    })

    socket.on("disconnect", () => {
        $.service.${serviceVarName}.numClients--

    });

})
`;
}
exports.default = getTemplate;
