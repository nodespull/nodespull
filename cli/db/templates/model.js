"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function model(tableName, pk) {
    return `const { type } = require("nodespull/core/type/db")
const { Database } = require("nodespull")
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
    Database.defineModel(withTable = "${tableName}").as({
        /* add attributes */
        uuid: {
            type: type.string,
            primaryKey: true,
            defaultValue: type.UUIDV1
        },


    })
})`;
}
exports.default = model;
