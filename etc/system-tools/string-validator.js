"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringParser = void 0;
const log_1 = require("../log");
class StringParser {
    /**
     * alphanumeric extended with "_"
     * does not start with numeric
     */
    static isExtendedAlphaNum(str) {
        if (!isNaN(Number(str[0])))
            return false;
        return str.match(/^[0-9a-zA-Z_]+$/) !== null;
    }
    /**
     * attemtps to convert "-" to "_"
     */
    static convertToExtendedAlphaNum_orThrow(str, errMessage) {
        str = str.split("-").join("_");
        if (!StringParser.isExtendedAlphaNum(str))
            errMessage ? new log_1.Log(errMessage).throwError() :
                new log_1.Log("format invalid").throwError();
        else
            return str;
    }
    static isJSReserved(str) {
        let reservedWords = ["do", "if", "else", "return", "for", "while", "switch", "try", "catch"];
        return reservedWords.includes(str);
    }
}
exports.StringParser = StringParser;
