"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDatabaseTemplate(dbSelector) {
    return `const { config, sysEnv, appEnv } = require("@nodespull/core")
const { system } = require("@nodespull/core/utils/db")


/**
 * database configurations
 */
config.setDatabase({
    isActive: false,
    system: system.mySQL,
    selector: "${dbSelector}",
    database: undefined,
    host: undefined,
    port: undefined,
    username: undefined,
    password: undefined
})
`;
}
exports.default = getDatabaseTemplate;
