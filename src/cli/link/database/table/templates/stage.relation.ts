// depreciated
export default function stageRelationTemplate(text:string|null, connectionSelector:string):string{
    let val = `const { editor } = require("@nodespull/core/database")("${connectionSelector}")
const { relations, onUpload, onRevert, rawQuery } = editor

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