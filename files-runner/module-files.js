"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_FilesRunner = void 0;
const common_1 = require("./common");
class Module_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(common_1.FilesEngine.rootPath, "module.js", { runFiles: true });
    }
}
exports.Module_FilesRunner = Module_FilesRunner;
