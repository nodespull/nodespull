
export default function cloneObject(obj:any) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy:any = {}
    for (var attr in obj) {
        copy[attr] = obj[attr];
    }
    return copy;
}