
export default function relation(tableName:string):string{
    return `const {Relations} = require("nodespull/database/tools")


Relations.set( "${tableName}", {

    one_to_one: {

        has: [],

        belongsTo: []

    },
        
    one_to_many: [],

    many_to_one: [],

    many_to_many: []
    
});`
}