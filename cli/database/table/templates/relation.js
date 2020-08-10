"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function relation(tableName, connectionSelector) {
    return `const { Database } = require("@nodespull/core/database")("${connectionSelector}")
const { Relations, onUpload, onRevert, rawQuery } = Database


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
