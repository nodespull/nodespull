
export default function model(tableName:string, connectionSelector:string):string{
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
})`

}