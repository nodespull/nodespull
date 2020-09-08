
export default function relation(tableName:string, connectionSelector:string):string{
return `const { editor } = require("@nodespull/core/database")("${connectionSelector}")
const { relations, onUpload, onRevert, rawQuery } = editor


onUpload(() => {
    relations.set(forTable = "${tableName}", {
        /** add FK to other tables */ has_one: [],
        /** add FK to other tables */ has_many: [],
        /** create join tables */ many_to_many: []
    });
})


onRevert(() => {
    relations.set(forTable = "${tableName}", {
        /** add FK to other tables */ has_one: [],
        /** add FK to other tables */ has_many: [],
        /** create join tables */ many_to_many: []
    });
})`
}