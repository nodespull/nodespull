// depreciated
export default function stageRelationTemplate(text:string|null):string{
    let val = `const { Relations } = require("nodespull/database/tools")
const { Database } = require("nodespull")
const { onUpload, onRevert, rawQuery } = Database

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