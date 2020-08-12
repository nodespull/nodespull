"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function spec(path, moduleVarName, locationDepth) {
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".mod";
    return `const { http, Database } = require("@nodespull/core")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth) + moduleFileName}")
const { expect } = require('chai')



describe("DELETE: ${path}", () => {

    it("should return status 200", async () => {
        [status, data] = await ${moduleVarName}.forward(req = {}).to(http.DELETE, "${path}")
        expect(status).to.equal(200)

    });


})`;
}
exports.default = spec;
