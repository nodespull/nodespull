// depreciated
export default function stageRelationTemplate(text:string|null, connectionSelector:string):string{
    let val = `const { Database } = require("@nodespull/core/database")("${connectionSelector}")
const { Relations, onUpload, onRevert, rawQuery } = Database

`
    if(!text) val += `
onUpload(() => {

})


onRevert(() => {

})
`
    else val += `
onUpload(() => {
${text}
})


onRevert(() => {
${text}
})
`
return val
}