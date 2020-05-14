import hash from "hash.js";

export class Hash_Sha{

    //cb with hashed equivalent
    static sha256(text:string){
        return hash.sha256().update(text).digest("hex");
    }

    static sha512(text:string){
        return hash.sha512().update(text).digest("hex");
    }
}