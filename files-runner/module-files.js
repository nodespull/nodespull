"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module_FilesRunner = void 0;
const common_1 = require("./common");
class Module_FilesRunner extends common_1.FilesRunner {
    constructor() {
        super();
        super.recursiveRun(common_1.FilesRunner.rootPath, "module.js");
    }
}
exports.Module_FilesRunner = Module_FilesRunner;
