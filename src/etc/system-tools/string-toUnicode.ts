export function toUnicode(keyPress: any) {
    var unicodeString = '';
    for (var i = 0; i < keyPress.length; i++) {
        var theUnicode = keyPress.charCodeAt(i).toString(16).toUpperCase();
        while (theUnicode.length < 4) {
            theUnicode = '0' + theUnicode;
        }
        theUnicode = '\\u' + theUnicode;
        unicodeString += theUnicode;
    }
    return unicodeString;
}