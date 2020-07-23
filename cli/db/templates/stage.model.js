"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// depreciated
function stageModelTemplate() {
    return `const { type } = require("nodespull/core/type/db")
const { Database } = require("nodespull")
const { onUpload, onRevert } = Database


onUpload(() => {

})


onRevert(() => {

})`;
}
exports.default = stageModelTemplate;
