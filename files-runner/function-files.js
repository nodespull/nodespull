"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Function_FilesRunner = void 0;
const common_1 = require("./common");
class Function_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(common_1.FilesEngine.rootPath, "func.js", { runFiles: true });
    }
}
exports.Function_FilesRunner = Function_FilesRunner;
