
export default function spec(path:string, moduleVarName:string, locationDepth:number):string{
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length-1*"Module".length)+".module"
    return `const { http, Database } = require("nodespull")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth)+moduleFileName}")
const { assert } = require("assert")


describe("POST: ${path}", () => {

    it("should return status 200", function () {

        return ${moduleVarName}.testWith(tags = ["post:${path}"])
            .forward(req = {})
            .to(http.POST, "${path}")
            .then((status, data) => {

                assert.equal(status, 200);

            })
    });


})`
}