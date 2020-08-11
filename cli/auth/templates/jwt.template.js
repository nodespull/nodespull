"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getJwtTemplate(authSelector) {
    return `const { npAuthProfile } = require("@nodespull/core")
const { JwtAlg, Duration } = require("@nodespull/core/crypt")


npAuthProfile.jwt({
    selector: "${authSelector}",
    secret: undefined,
    expiresIn: Duration.min(60),
    algorithm: JwtAlg.HS256,
    onError: {
        continueToRoute: false,
        statusCode: 401,
        json: null
    }
})
    
`;
}
exports.default = getJwtTemplate;
