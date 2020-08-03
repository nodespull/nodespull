"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function relation(tableName) {
    return `const { Relations } = require("nodespull/database/tools")
const { Database } = require("nodespull")
const { onUpload, onRevert, rawQuery } = Database


onUpload(() => {
    Relations.set(forTable = "${tableName}", {
        /** add FK to other tables */ has_one: [],
        /** add FK to other tables */ has_many: [],
        /** create join tables */ many_to_many: []
    });
})


onRevert(() => {
    Relations.set(forTable = "${tableName}", {
        /** add FK to other tables */ has_one: [],
        /** add FK to other tables */ has_many: [],
        /** create join tables */ many_to_many: []
    });
})`;
}
exports.default = relation;
