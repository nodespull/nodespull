"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathVar = void 0;
let PathVar = /** @class */ (() => {
    class PathVar {
    }
    PathVar.packageJson = process.argv[1].split("/").slice(0, -2).join("/") + "/package.json";
    PathVar.appModule = process.argv[1].split("/").slice(0, -1).join("/") + "/app";
    PathVar.dbModule = process.argv[1].split("/").slice(0, -1).join("/") + "/database";
    PathVar.appEnvModule = process.argv[1].split("/").slice(0, -1).join("/") + "/environment";
    PathVar.etc_os_dir = process.argv[1].split("/").slice(0, -2).join("/") + "/.etc/os";
    PathVar.etc_var_dir = process.argv[1].split("/").slice(0, -2).join("/") + "/.etc/var";
    return PathVar;
})();
exports.PathVar = PathVar;
