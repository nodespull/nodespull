"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function spec(path, moduleVarName, locationDepth) {
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".mod";
    return `const { http, Database } = require("@nodespull/core")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth) + moduleFileName}")
const { assert } = require("assert")


describe("PUT: ${path}", () => {

    it("should return status 200", function () {

        return ${moduleVarName}.testWith(tags = ["put:${path}"])
            .forward(req = {})
            .to(http.PUT, "${path}")
            .then((status, data) => {

                assert.equal(status, 200);

            })
    });


})`;
}
exports.default = spec;
