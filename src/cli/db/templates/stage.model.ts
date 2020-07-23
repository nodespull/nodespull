// depreciated
export default function stageModelTemplate():string{
    return `const { type } = require("nodespull/core/type/db")
const { Database } = require("nodespull")
const { onUpload, onRevert } = Database


onUpload(() => {

})


onRevert(() => {

})`
}