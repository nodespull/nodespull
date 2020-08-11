"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cloneObject(obj) {
    if (null == obj || "object" != typeof obj)
        return obj;
    var copy = {};
    for (var attr in obj) {
        copy[attr] = obj[attr];
    }
    return copy;
}
exports.default = cloneObject;
