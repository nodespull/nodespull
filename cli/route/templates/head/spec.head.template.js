"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function spec(path, moduleVarName, locationDepth) {
    let moduleFileName = moduleVarName.substr(0, moduleVarName.length - 1 * "Module".length) + ".module";
    return `const { http, Database } = require("nodespull")
const { ${moduleVarName} } = require("${'../'.repeat(locationDepth) + moduleFileName}")
const { assert } = require("assert")


describe("HEAD: ${path}", () => {

    it("should return status 200", function () {

        return ${moduleVarName}.testWith(tags = ["head:${path}"])
            .forward(req = {})
            .to(http.HEAD, "${path}")
            .then((status, data) => {

                assert.equal(status, 200);

            })
    });


})`;
}
exports.default = spec;
