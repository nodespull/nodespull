export default function getAppEnvTemplate(env:string):string{
    return `const { npAppEnv } = require("nodespull")

const $ = npAppEnv({
    production: ${env === "prod"}
})
`
}