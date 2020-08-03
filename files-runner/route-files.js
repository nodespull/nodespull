"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route_FilesRunner = void 0;
const common_1 = require("./common");
class Route_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(common_1.FilesEngine.appRootPath, "delete.js", { runFiles: true });
        super.recursiveSearch(common_1.FilesEngine.appRootPath, "get.js", { runFiles: true });
        super.recursiveSearch(common_1.FilesEngine.appRootPath, "head.js", { runFiles: true });
        super.recursiveSearch(common_1.FilesEngine.appRootPath, "post.js", { runFiles: true });
        super.recursiveSearch(common_1.FilesEngine.appRootPath, "put.js", { runFiles: true });
    }
}
exports.Route_FilesRunner = Route_FilesRunner;
