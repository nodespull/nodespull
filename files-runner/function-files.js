"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function_FilesRunner = void 0;
const common_1 = require("./common");
class Function_FilesRunner extends common_1.FilesRunner {
    constructor() {
        super();
        super.recursiveRun(common_1.FilesRunner.rootPath, "func.js");
    }
}
exports.Function_FilesRunner = Function_FilesRunner;
