import { Log } from "../log"

export class StringParser {
    /**
     * alphanumeric extended with "_"
     * does not start with numeric
     */
    static isExtendedAlphaNum(str:string){
        if(!isNaN(Number(str[0]))) return false
        return str.match(/^[0-9a-zA-Z_]+$/) !== null
    }

    /**
     * attemtps to convert "-" to "_"
     */
    static convertToExtendedAlphaNum_orThrow(str:string, errMessage?:string){
        str = str.split("-").join("_")
        if(!StringParser.isExtendedAlphaNum(str)) errMessage?new Log(errMessage).throwError():
            new Log("format invalid").throwError()
        else return str
    }

    static isJSReserved(str:string){
        let reservedWords = ["do", "if", "else", "return", "for", "while", "switch", "try", "catch"]
        return reservedWords.includes(str)
    }
}