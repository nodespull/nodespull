"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function model(tableName, pk) {
    return `const { type } = require("@nodespull/core/utils/db")
const { Database } = require("@nodespull/core")
const { onUpload, onRevert, rawQuery } = Database


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
