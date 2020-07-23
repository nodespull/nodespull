
export default function model(tableName:string, pk?:any):string{
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
})`

}