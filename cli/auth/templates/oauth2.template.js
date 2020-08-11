"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getOauth2Template(authSelector) {
    return `const { npAuthProfile } = require("@nodespull/core/crypt")


npAuthProfile.oauth2({
    selector: "${authSelector}",
    onInit: (authorizationCode, next)=>{
        next(null)
    }
})

`;
}
exports.default = getOauth2Template;
