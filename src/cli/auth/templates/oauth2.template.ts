
export default function getOauth2Template(authSelector:string):string{
    return `const { npAuthProfile } = require("@nodespull/core")
const { sysEnv, sysApp } = require("@nodespull/core/env")


npAuthProfile.oauth2({
    selector: "${authSelector}",
    onInit: (authorizationCode, next)=>{
        next(null)
    }
})

`
}
