"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service_FilesRunner = void 0;
const common_1 = require("./common");
class Service_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(common_1.FilesEngine.rootPath, "service.js", { runFiles: true });
    }
}
exports.Service_FilesRunner = Service_FilesRunner;
