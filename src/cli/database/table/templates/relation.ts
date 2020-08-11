
export default function relation(tableName:string, connectionSelector:string):string{
return `const { Database } = require("@nodespull/core/database")("${connectionSelector}")
const { Relations, onUpload, onRevert, rawQuery } = Database


onUpload(() => {
    Relations.set(forTable = "${tableName}", {
        /** add FK to other tables */ has_one: [],
        /** add FK to other tables */ has_many: [],
        /** create join tables */ many_to_many: []
    });
})


onRevert(() => {
    Relations.set(forTable = "${tableName}", {
        /** add FK to other tables */ has_one: [],
        /** add FK to other tables */ has_many: [],
        /** create join tables */ many_to_many: []
    });
})`
}