"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function model(tableName, connectionSelector) {
    return `const { Database } = require("@nodespull/core/database")("${connectionSelector}")
const { type, onUpload, onRevert, rawQuery } = Database


onUpload(() => {
    Database.defineModel(withTable = "${tableName}").as({
        /* add attributes */
        uuid: {
            type: type.string,
            primaryKey: true,
            defaultValue: type.UUIDV1
        },
        
    })
})


onRevert(() => {
    rawQuery("DROP TABLE ${tableName}")
})`;
}
exports.default = model;
