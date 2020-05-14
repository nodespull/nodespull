"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exe_log_1 = require("../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const delete_1 = __importDefault(require("./templates/delete/delete"));
const get_1 = __importDefault(require("./templates/get/get"));
const post_1 = __importDefault(require("./templates/post/post"));
const put_1 = __importDefault(require("./templates/put/put"));
const head_1 = __importDefault(require("./templates/head/head"));
const spec_delete_1 = __importDefault(require("./templates/delete/spec.delete"));
const spec_get_1 = __importDefault(require("./templates/get/spec.get"));
const spec_post_1 = __importDefault(require("./templates/post/spec.post"));
const spec_put_1 = __importDefault(require("./templates/put/spec.put"));
const spec_head_1 = __importDefault(require("./templates/head/spec.head"));
const root = "app.modules";
const templateList = {
    delete: { delete: delete_1.default, spec_del: spec_delete_1.default },
    get: { get: get_1.default, spec_get: spec_get_1.default },
    post: { post: post_1.default, spec_post: spec_post_1.default },
    put: { put: put_1.default, spec_put: spec_put_1.default },
    head: { head: head_1.default, spec_head: spec_head_1.default }
};
function getTemplate(template, filePath, extCount) {
    let fileNameParts = filePath.split("/").pop().split("."); // remove absolute part of path, split fileName parts
    fileNameParts = fileNameParts.slice(0, fileNameParts.length - (1 + extCount)); //remove all from .get up
    let routePath = "";
    while (fileNameParts.length > 0) {
        routePath += "/" + fileNameParts.shift(); //reconstruct path without parent dir and .get.ext
    }
    return template(routePath); // load template with routePath
}
function newRoute(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let args = name.split("/");
        let fileName = "";
        let routeDirPath = "routes";
        while (args.length > 0) {
            let e = args.shift();
            fileName = fileName != "" ? (fileName + "." + e) : e;
            routeDirPath = routeDirPath + "/" + fileName;
            yield exe_log_1.cmd("mkdir", ["-p", root + "/" + routeDirPath], false);
        }
        setTimeout(() => {
            for (let templGroupKey of Object.keys(templateList)) {
                let templDirPath = routeDirPath + "/" + fileName + "." + templGroupKey;
                exe_log_1.cmd("mkdir", ["-p", root + "/" + templDirPath]);
                for (let templateKey of Object.keys(templateList[templGroupKey])) {
                    let templFilePath = templDirPath + "/" + (fileName + "." + templGroupKey);
                    let extCount = 1;
                    if (templateKey.startsWith("spec")) {
                        templFilePath += ".spec.js";
                        extCount = 2;
                    }
                    else
                        templFilePath += ".js";
                    exe_log_1.cmd("touch", [root + "/" + templFilePath]);
                    fs_1.default.writeFile(root + "/" + templFilePath, getTemplate(templateList[templGroupKey][templateKey], templFilePath, extCount), () => { });
                }
            }
        }, 2000);
    });
}
exports.newRoute = newRoute;
