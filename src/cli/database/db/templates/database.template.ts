
export default function getDatabaseTemplate(dbSelector:string):string{
    return `const { config } = require("@nodespull/core")
const { system } = require("@nodespull/core/utils/db")


/**
 * database configurations
 */
config.setDatabase({
    isActive: false,
    system: system.NONE,
    selector: "${dbSelector}",
    database: undefined,
    host: undefined,
    port: undefined,
    username: undefined,
    password: undefined
})
`
}
