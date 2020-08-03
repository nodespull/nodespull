"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const default_content_1 = __importDefault(require("./default-content"));
const json_1 = require("../../etc/system-tools/json");
const exe_log_1 = require("../../cli/exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const install_1 = require("../../install");
const swaggerUi = require('swagger-ui-express');
const packageJson = json_1.parseJSON("../package.json");
let mainSwagger = {};
function default_1(app) {
    if (!fs_1.default.existsSync("./" + install_1.etc_var_dir + "/swagger.json")) {
        exe_log_1.cmd("mkdir", ["-p", "./" + install_1.etc_var_dir]);
        exe_log_1.cmd("touch", ["./" + install_1.etc_var_dir + "/swagger.json"]);
        json_1.writeJSON("./" + install_1.etc_var_dir + "/swagger.json", default_content_1.default());
    }
    try {
        let docs;
        docs = json_1.parseJSON("./" + install_1.etc_var_dir + "/swagger.json");
        //build swager file
        recursiveBuild("./" + install_1.appModule);
        if (JSON.stringify(docs) != JSON.stringify(Object.assign(Object.assign({}, default_content_1.default()), mainSwagger))) {
            json_1.writeJSON("./" + install_1.etc_var_dir + "/swagger.json", Object.assign(Object.assign({}, default_content_1.default()), mainSwagger));
        }
        //load swagger file
        docs = json_1.parseJSON("./" + install_1.etc_var_dir + "/swagger.json");
        app.use('/api-docs', function (req, res, next) {
            docs.host = req.get('host');
            req["swaggerDoc"] = docs;
            next();
        }, swaggerUi.serve, swaggerUi.setup());
    }
    catch (_a) {
        console.log(`swagger file has invalid format. Please delete file "${install_1.etc_var_dir}/swagger.json" and try again`);
    }
}
exports.default = default_1;
/**
 * run all .js file recursively, given a folder
 */
let pathNames = [];
function recursiveBuild(path) {
    try {
        const dirents = fs_1.default.readdirSync(path, { withFileTypes: true });
        const fileNames = dirents
            .filter(dirent => dirent.isFile())
            .map(dirent => dirent.name);
        const folderNames = dirents
            .filter(dirent => !dirent.isFile())
            .map(dirent => dirent.name);
        for (let folderName of folderNames)
            recursiveBuild(path + "/" + folderName);
        for (let fileName of fileNames) {
            if (fileName != "swagger.json")
                continue;
            let swaggerPath = json_1.parseJSON(path + "/" + fileName);
            let pathName = Object.keys(swaggerPath)[0];
            if (pathNames.includes(pathName))
                mainSwagger["paths"][pathName] = Object.assign(Object.assign({}, mainSwagger["paths"][pathName]), swaggerPath[pathName]);
            else {
                mainSwagger["paths"] = Object.assign(Object.assign({}, mainSwagger["paths"]), swaggerPath);
                pathNames.push(pathName);
            }
        }
    }
    catch (_a) { }
}
