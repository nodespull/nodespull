import { oauth2AuthProfileInterface } from "./interface";

export class npOauth2 {
    constructor(public _args: oauth2AuthProfileInterface){}

    /**
     * parse authorization code as defined in the profile
     */
    parse(authorization: string, callback: Function){
        this._args.onInit(authorization, callback)
    }
}