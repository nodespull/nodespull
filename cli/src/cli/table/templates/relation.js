"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function relation(tableName) {
    return `const {Relations} = require("nodespull/database/tools")


Relations.connect(

    "${tableName}", one_to_one = [],

    "${tableName}", one_to_many = [],

    "${tableName}", many_to_one = [],

    "${tableName}", many_to_many = []
);`;
}
exports.default = relation;
