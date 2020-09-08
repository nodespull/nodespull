
export default function spec(path:string, moduleVarName:string, locationDepth:number):string{
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".mod"
    return `const { http, link } = require("@nodespull/core")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth)+moduleFileName}")
const { expect } = require('chai')



describe("GET: ${path}", () => {

    it("should return status 200", async () => {
        [status, data] = await ${moduleVarName}.forward(req = {}).to(http.GET, "${path}")
        expect(status).to.equal(200)

    });


})`
}