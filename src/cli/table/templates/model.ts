
export default function model(tableName:string, pk?:any):string{
    return `const {Database} = require("nodespull")
const {type} = require("nodespull/core/type/db")


Database.defineTable( "${tableName}" ).as({
    // Add attr def as Key:Value pairs - e.g. \`email: type.string,\`
    ${pk?(`${pk.attr}: {type: type.${pk?pk.type:""}, primaryKey: true}`):""}


})`
}