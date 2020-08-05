"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getAppEnvTemplate(env) {
    return `const { npAppEnv } = require("nodespull")

npAppEnv({
    production: ${env === "prod"}
})
`;
}
exports.default = getAppEnvTemplate;
