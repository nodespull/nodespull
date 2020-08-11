"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// depreciated
function stageRelationTemplate(text) {
    let val = `const { Relations } = require("nodespull/database/tools")
const { Database } = require("nodespull")
const { onUpload, onRevert, rawQuery } = Database

`;
    if (!text)
        val += `
onUpload(() => {

})


onRevert(() => {

})
`;
    else
        val += `
onUpload(() => {
${text}
})


onRevert(() => {
${text}
})
`;
    return val;
}
exports.default = stageRelationTemplate;
