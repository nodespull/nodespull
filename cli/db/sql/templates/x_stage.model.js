"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stageModelTemplate(text) {
    let val = `const { type } = require("nodespull/core/type/db")
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
exports.default = stageModelTemplate;
