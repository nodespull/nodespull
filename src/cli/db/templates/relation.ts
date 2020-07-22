
export default function relation(tableName:string):string{
return `const { Relations } = require("nodespull/database/tools")
const { Database } = require("nodespull")
const { onUpload, onRevert } = Database


onUpload(() => {
    Database.rawQuery(null)
    Relations.set(forTable = "${tableName}", {
        one_to_one: {
            /** add FK to other tables */ has: [],
            /** add FKs to this table */ belongsTo: []
        },
        /** add FK to other tables */ one_to_many: ["messages"],
        /** create join tables */ many_to_many: []
    });
})


onRevert(() => {
    Database.rawQuery(null)
    Relations.set(forTable = "${tableName}", {
        one_to_one: {
            /** add FK to other tables */ has: [],
            /** add FKs to this table */ belongsTo: []
        },
        /** add FK to other tables */ one_to_many: [],
        /** create join tables */ many_to_many: []
    });
})`
}