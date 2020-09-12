
export default function getJwtTemplate(authSelector:string):string{
    return `const { npAuthProfile } = require("@nodespull/core")
const { JwtAlg, Duration } = require("@nodespull/core/crypt")
const { sysEnv } = require("@nodespull/core/env")


npAuthProfile.jwt({
    selector: "${authSelector}",
    secret: undefined,
    expiresIn: Duration.min(60),
    algorithm: JwtAlg.HS256,
    onError: {
        continueToRoute: false,
        statusCode: 401,
        json: null
    },
    onFinish: (req, data, err, next) => {
        if(!err) req['tokenData'] = data
        next()
    }
})
    
`
}
