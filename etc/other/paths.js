"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathVar = void 0;
let PathVar = /** @class */ (() => {
    class PathVar {
    }
    PathVar.packageJson = process.argv[1].split("/").slice(0, -2).join("/") + "/package.json";
    return PathVar;
})();
exports.PathVar = PathVar;
