"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route_FilesRunner = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Route_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.appModule, "delete.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.appModule, "get.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.appModule, "head.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.appModule, "post.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.appModule, "put.js", { runFiles: true });
    }
}
exports.Route_FilesRunner = Route_FilesRunner;
