import { npJWT } from "./jwt";
import { DurationInstance } from "..";

export interface AuthProfile {

}

export interface npJWTGuard extends npJWT{}

export interface JwtAuthProfileInterface{
    selector: string,
    expiresIn: DurationInstance, //seconds
    algorithm: string,
    secret?: string,
    privateKey?: string,
    publicKey?: string,
    onError: {
        continueToRoute: boolean,
        statusCode: number,
        json: object|null|undefined
    },
    onFinish?: Function
}

export interface oauth2AuthProfileInterface{
    selector: string,
    onInit: Function
}

export interface AuthControllerProfileStorage_interface{
    jwt: {[selector:string]: AuthProfile}
    oauth2: {[selector:string]: AuthProfile}
}