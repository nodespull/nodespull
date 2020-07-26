"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getModuleTemplate(moduleVarName) {
    if (moduleVarName.slice(-1 * "Module".length) != "Module")
        moduleVarName = moduleVarName.toLowerCase() + "Module";
    return `const { npModule } = require("nodespull")


exports.${moduleVarName} = npModule({
    name: "${moduleVarName}",
    isModuleActive: true,
    isModuleProtected: false,
    imports: []
})
`;
}
exports.default = getModuleTemplate;
