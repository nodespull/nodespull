"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function relation(tableName) {
    return `const {Relations} = require("nodespull/database/tools")


Relations.set( "${tableName}", {

    one_to_one: {

        has: [],

        belongsTo: []

    },
        
    one_to_many: [],

    many_to_one: [],

    many_to_many: []
    
});`;
}
exports.default = relation;
