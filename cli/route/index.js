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
exports.newRoute = void 0;
const exe_log_1 = require("../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const install_1 = require("../../install");
const delete_template_1 = __importDefault(require("./templates/delete/delete.template"));
const get_template_1 = __importDefault(require("./templates/get/get.template"));
const post_template_1 = __importDefault(require("./templates/post/post.template"));
const put_template_1 = __importDefault(require("./templates/put/put.template"));
const head_template_1 = __importDefault(require("./templates/head/head.template"));
const spec_delete_template_1 = __importDefault(require("./templates/delete/spec.delete.template"));
const spec_get_template_1 = __importDefault(require("./templates/get/spec.get.template"));
const spec_post_template_1 = __importDefault(require("./templates/post/spec.post.template"));
const spec_put_template_1 = __importDefault(require("./templates/put/spec.put.template"));
const spec_head_template_1 = __importDefault(require("./templates/head/spec.head.template"));
const swagger_delete_template_1 = __importDefault(require("./templates/delete/swagger.delete.template"));
const swagger_get_template_1 = __importDefault(require("./templates/get/swagger.get.template"));
const swagger_post_template_1 = __importDefault(require("./templates/post/swagger.post.template"));
const swagger_put_template_1 = __importDefault(require("./templates/put/swagger.put.template"));
const swagger_head_template_1 = __importDefault(require("./templates/head/swagger.head.template"));
const root = install_1.appModule;
const templateList = {
    delete: { delete: delete_template_1.default, spec_del: spec_delete_template_1.default, swag_del: swagger_delete_template_1.default },
    get: { get: get_template_1.default, spec_get: spec_get_template_1.default, swag_get: swagger_get_template_1.default },
    post: { post: post_template_1.default, spec_post: spec_post_template_1.default, swag_post: swagger_post_template_1.default },
    put: { put: put_template_1.default, spec_put: spec_put_template_1.default, swag_put: swagger_put_template_1.default },
    head: { head: head_template_1.default, spec_head: spec_head_template_1.default, swag_head: swagger_head_template_1.default }
};
function getTemplate(moduleName, routeName, template, filePath, extCount) {
    let parts = routeName.split("/");
    if (moduleName == "mainModule")
        routeName = "/" + parts.slice(2, parts.length - 2).join("/"); // remove 'server/_routes'
    else
        routeName = "/" + parts.slice(3, parts.length - 2).join("/"); // remove 'server/$moduleName/_routes'
    routeName = routeName.replace("//", "/");
    //remove dot in last part of deep paths
    parts = routeName.split("/");
    parts.shift(); // remove empty first e
    let depthCountFromModule = 2 + parts.length; //levels deep from module
    if (parts.length > 1) {
        let deepName = "/" + parts.shift();
        for (let part of parts) {
            deepName += "/" + part.split(".").pop();
        }
        routeName = deepName;
    }
    routeName = "/" + routeName.substring(2, routeName.length); // remove underscore, e.g. /_name/path
    return template(routeName, moduleName, depthCountFromModule); // load template with routePath
}
function newRoute(name) {
    return __awaiter(this, void 0, void 0, function* () {
        let args = name.split("/");
        let moduleVarName = "mainModule";
        if (args[0].toLowerCase().includes(".module")) {
            moduleVarName = args[0].toLowerCase().split(".")[0] + "Module";
            args = args.slice(1);
        }
        let fileName = "";
        let fileName_withUnderscore = "";
        let routeDirPath = "main-module/rest";
        if (moduleVarName != "mainModule")
            routeDirPath = "main-module/" + moduleVarName + "/rest";
        while (args.length > 0) {
            let e = args.shift();
            fileName = fileName != "" ? (fileName + "." + e) : e;
            fileName_withUnderscore = fileName_withUnderscore != "" ? (fileName_withUnderscore + "." + e) : "_" + e;
            routeDirPath = routeDirPath + "/" + fileName_withUnderscore;
            yield exe_log_1.cmd("mkdir", ["-p", root + "/" + routeDirPath], false);
        }
        setTimeout(() => {
            for (let templGroupKey of Object.keys(templateList)) {
                let templDirPath = routeDirPath + "/" + fileName + "." + templGroupKey;
                exe_log_1.cmd("mkdir", ["-p", root + "/" + templDirPath]);
                for (let templateKey of Object.keys(templateList[templGroupKey])) {
                    let templFilePath = templDirPath + "/" + (fileName + "." + templGroupKey);
                    let extCount = 2;
                    if (templateKey.startsWith("spec")) {
                        templFilePath += ".spec.js";
                        extCount = 3;
                    }
                    else if (templateKey.startsWith("swag")) {
                        templFilePath = templDirPath + "/swagger.json";
                        extCount = 1;
                    }
                    else
                        templFilePath += ".js";
                    exe_log_1.cmd("touch", [root + "/" + templFilePath]);
                    fs_1.default.writeFile(root + "/" + templFilePath, getTemplate(moduleVarName, templDirPath + "/" + fileName, //remove initial underscore
                    templateList[templGroupKey][templateKey], templFilePath, extCount), () => { });
                }
            }
        }, 2000);
    });
}
exports.newRoute = newRoute;
