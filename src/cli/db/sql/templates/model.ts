
export default function model(tableName:string, pk?:any):string{
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
})`

}