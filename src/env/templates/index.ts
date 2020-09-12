export default function getAppEnvTemplate(env:string):string{
    return `const { npEnv } = require("@nodespull/core")

/**
 * accessible within app modules
 */
npEnv.app.loadVars(forTags = [${env=="local"?'':env}], {

})`
}