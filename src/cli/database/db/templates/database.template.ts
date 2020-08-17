
export default function getDatabaseTemplate(dbSelector:string):string{
    return `const { config, npDB } = require("@nodespull/core")
const { system } = require("@nodespull/core/utils/db")
const { sysEnv, appEnv } = require("@nodespull/core/env")


/**
 * database configurations
 */
npDB.register({
    isActive: false,
    system: system.mySQL,
    selector: "${dbSelector}",
    database: undefined,
    host: undefined,
    port: undefined,
    username: undefined,
    password: undefined
})
`
}
