
export default function getTemplate(serviceVarName:string, moduleVarName:string):string{
    if(moduleVarName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module"
    return `const { Database, npService, socketIO } = require("nodespull")
const { ${moduleVarName} } = require("../${moduleFileName}")


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
`
}



