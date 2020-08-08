import { AuthProfile, JwtAuthProfileInterface, oauth2AuthProfileInterface, AuthControllerProfileStorage_interface } from "./models/interface";
import { Log } from "../etc/log";
import { StringParser } from "../etc/system-tools/string-validator";
import { npJWT } from "./models/jwt";
import { npOauth2 } from "./models/oauth2";

export class AuthController {
    static _profiles: AuthControllerProfileStorage_interface = {jwt:{}, oauth2:{}}

    static jwt(args:JwtAuthProfileInterface){
        StringParser.convertToExtendedAlphaNum_orThrow(args.selector,`expected jwt selector '${args.selector}' as an alphanumeric`)
        this._profiles.jwt[args.selector] = new npJWT(args)
    }

    static oauth2(args:oauth2AuthProfileInterface){
        StringParser.convertToExtendedAlphaNum_orThrow(args.selector,`expected jwt selector '${args.selector}' as an alphanumeric`)
        this._profiles.oauth2[args.selector] = new npOauth2(args)
    }
}
