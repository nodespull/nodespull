import { AuthProfile, JwtAuthProfileInterface, oauth2AuthProfileInterface, AuthControllerProfileStorage_interface } from "./models/interface";
import { Log } from "../etc/log";
import { StringParser } from "../etc/system-tools/string-validator";
import { npJWT } from "./models/jwt";
import { npOauth2 } from "./models/oauth2";
import { Hash_Algorithm } from "../etc/system-tools/hash";


export class AuthController {
    static _profiles: AuthControllerProfileStorage_interface = {jwt:{}, oauth2:{}}

    static jwt(args:JwtAuthProfileInterface){
        StringParser.convertToExtendedAlphaNum_orThrow(args.selector,`expected jwt selector '${args.selector}' as an alphanumeric`)
        AuthController._profiles.jwt[args.selector] = new npJWT(args)
    }

    static oauth2(args:oauth2AuthProfileInterface){
        StringParser.convertToExtendedAlphaNum_orThrow(args.selector,`expected jwt selector '${args.selector}' as an alphanumeric`)
        AuthController._profiles.oauth2[args.selector] = new npOauth2(args)
    }
}



export const jwt = AuthController._profiles.jwt
export const oauth2 = AuthController._profiles.oauth2

export const hash = {
    SHA256: {createWith: (str:string)=>{ return Hash_Algorithm.sha256(str) }},
    SHA512: {createWith: (str:string)=>{ return Hash_Algorithm.sha512(str) }}
}

export class Duration{ //Instance factory
    static sec(num:number){ return new DurationInstance(num) }
    static min(num:number){ return new DurationInstance(num*60) }
    static hour(num:number){ return new DurationInstance(num*60*60) }
    static day(num:number){ return new DurationInstance(num*60*60*24)}
}
export class DurationInstance {
    constructor(public duration_sec:number){}
    sec(num:number){this.duration_sec+num; return this}
    min(num:number){this.duration_sec+(num*60); return this}
    hour(num:number){this.duration_sec+(num*60*60); return this}
    day(num:number){this.duration_sec+(num*60*60*24); return this}
}

export enum JwtAlg {
    HS256 = "hs256"
}