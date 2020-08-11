"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAppEnvTemplate(env) {
    return `const { npEnv } = require("@nodespull/core")

/**
 * accessible within app modules
 */
npEnv.app.loadVars(forTags = [${env == "prod" ? '"prod"' : ''}], {

})`;
}
exports.default = getAppEnvTemplate;
