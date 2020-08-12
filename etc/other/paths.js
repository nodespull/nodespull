"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PathVar = void 0;
let PathVar = /** @class */ (() => {
    class PathVar {
    }
    PathVar.isProcessFromMocha = process.argv[1].split("/").pop() == "mocha";
    PathVar.isProcessFromRoot = PathVar.isProcessFromMocha;
    PathVar.getPackageJson = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/package.json";
        return process.argv[1].split("/").slice(0, -2).join("/") + "/package.json";
    };
    PathVar.getAppModule = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/src/app";
        return process.argv[1].split("/").slice(0, -1).join("/") + "/app";
    };
    PathVar.getDbModule = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/src/database";
        return process.argv[1].split("/").slice(0, -1).join("/") + "/database";
    };
    PathVar.getAppEnvModule = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/src/environment";
        return process.argv[1].split("/").slice(0, -1).join("/") + "/environment";
    };
    PathVar.getEtc_os_dir = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/.etc/os";
        return process.argv[1].split("/").slice(0, -2).join("/") + "/.etc/os";
    };
    PathVar.getEtc_var_dir = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/.etc/var";
        return process.argv[1].split("/").slice(0, -2).join("/") + "/.etc/var";
    };
    PathVar.getProcessEnv = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/config";
        return process.argv[1].split("/").slice(0, -2).join("/") + "/config";
    };
    PathVar.getSrc = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/src";
        return process.argv[1].split("/").slice(0, -2).join("/") + "/src";
    };
    PathVar.getRoot = () => {
        if (PathVar.isProcessFromRoot)
            return process.cwd() + "/";
        return process.argv[1].split("/").slice(0, -2).join("/");
    };
    return PathVar;
})();
exports.PathVar = PathVar;
