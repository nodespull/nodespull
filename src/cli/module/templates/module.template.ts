
export default function getModuleTemplate(moduleVarName:string):string{
    if(moduleVarName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    return `const { npModule } = require("@nodespull/core")
const { jwt } = require("@nodespull/core/crypt")


exports.${moduleVarName} = npModule({
    name: "${moduleVarName}",
    loadRoutes: true,
    useGuard: null,
    imports: []
})
`
}
