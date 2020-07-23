// depreciated
export default function stageRelationTemplate():string{
    return `const { Relations } = require("nodespull/database/tools")
const { Database } = require("nodespull")
const { onUpload, onRevert } = Database


onUpload(() => {

})


onRevert(() => {

})`
}