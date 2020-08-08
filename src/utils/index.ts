
import {Hash_Algorithm} from "../etc/system-tools/hash"
import { AuthController } from "../auth";




export const jwt = AuthController._profiles.jwt
export const oauth2 = AuthController._profiles.oauth2
export const hash = {
    SHA256:{createWith: (str:string)=>{return Hash_Algorithm.sha256(str)}},
    SHA512:{createWith: (str:string)=>{return Hash_Algorithm.sha512(str)}}
}