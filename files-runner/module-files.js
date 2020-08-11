"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_FilesLoader = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Module_FilesLoader extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.appModule, "module.js", { runFiles: true });
    }
}
exports.Module_FilesLoader = Module_FilesLoader;
