
export default function relation(tableName:string):string{
    return `const {Relations} = require("nodespull/database/tools")


Relations.connect(

    "${tableName}", one_to_one = [],

    "${tableName}", one_to_many = [],

    "${tableName}", many_to_one = [],

    "${tableName}", many_to_many = []
);`
}