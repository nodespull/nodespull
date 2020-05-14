"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function model(tableName, pk) {
    return `const {Database} = require("nodespull")
const {type} = require("nodespull/core/type/db")


Database.defineTable( "${tableName}" ).as({
    // Add attr def as Key:Value pairs - e.g. \`email: type.string,\`
    ${pk ? (`${pk.attr}: {type: type.${pk ? pk.type : ""}, primaryKey: true}`) : ""}


})`;
}
exports.default = model;
