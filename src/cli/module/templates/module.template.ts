
export default function getModuleTemplate(moduleVarName:string):string{
    if(moduleVarName.slice(-1*"Module".length) != "Module") moduleVarName = moduleVarName.toLowerCase()+"Module"
    return `const { npModule } = require("nodespull")


exports.${moduleVarName} = npModule({
    name: "${moduleVarName}",
    isModuleActive: true,
    isModuleProtected: false,
    imports: []
})
`
}
