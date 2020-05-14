"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_content_1 = __importDefault(require("./default-content"));
const json_1 = require("../../etc/system-tools/json");
const fs_1 = __importDefault(require("fs"));
const install_1 = require("../../install");
let mainSwagger;
function default_1() {
    json_1.writeJSON("./" + install_1.sys_dir + "/swagger.json", default_content_1.default());
    recursiveLoad("./" + install_1.appModule);
    json_1.writeJSON("./" + install_1.sys_dir + "/swagger.json", Object.assign(Object.assign({}, default_content_1.default()), { mainSwagger }));
}
exports.default = default_1;
/**
 * run all .js file recursively, given a folder
 */
function recursiveLoad(path) {
    try {
        const dirents = fs_1.default.readdirSync(path, { withFileTypes: true });
        const fileNames = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
        const folderNames = dirents
            .filter(dirent => !dirent.isFile())
            .map(dirent => dirent.name);
        for (let folderName of folderNames)
            recursiveLoad(path + "/" + folderName);
        for (let fileName of fileNames) {
            if (fileName != "swagger.json")
                continue;
            let swaggerPath = json_1.parseJSON(path + "/" + fileName);
            mainSwagger["paths"] = Object.assign(Object.assign({}, mainSwagger["paths"]), { swaggerPath });
        }
    }
    catch (_a) { }
}
