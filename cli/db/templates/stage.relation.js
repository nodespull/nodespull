"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// depreciated
function stageRelationTemplate() {
    return `const { Relations } = require("nodespull/database/tools")
const { Database } = require("nodespull")
const { onUpload, onRevert } = Database


onUpload(() => {

})


onRevert(() => {

})`;
}
exports.default = stageRelationTemplate;
