export default function getAppEnvTemplate(env:string):string{
    return `const { npAppEnv } = require("nodespull")

npAppEnv({
    production: ${env === "prod"}
})
`
}