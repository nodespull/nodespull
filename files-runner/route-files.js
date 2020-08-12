"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestRoute_FilesLoader = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class RestRoute_FilesLoader extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.getAppModule(), "delete.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.getAppModule(), "get.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.getAppModule(), "head.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.getAppModule(), "post.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.getAppModule(), "put.js", { runFiles: true });
    }
}
exports.RestRoute_FilesLoader = RestRoute_FilesLoader;
