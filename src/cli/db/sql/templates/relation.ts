
export default function relation(tableName:string):string{
return `const { Relations } = require("@nodespull/core/database/tools")
const { Database } = require("@nodespull/core")
const { onUpload, onRevert, rawQuery } = Database


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