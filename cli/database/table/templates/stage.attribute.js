"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stageModelTemplate(text, connectionSelector) {
    let val = `const { Database } = require("@nodespull/core/database")("${connectionSelector}")
const { type, onUpload, onRevert, rawQuery } = Database

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
exports.default = stageModelTemplate;
