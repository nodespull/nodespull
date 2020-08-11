
export default function getOauth2Template(authSelector:string):string{
    return `const { npAuthProfile } = require("@nodespull/core/crypt")


npAuthProfile.oauth2({
    selector: "${authSelector}",
    onInit: (authorizationCode, next)=>{
        next(null)
    }
})

`
}
