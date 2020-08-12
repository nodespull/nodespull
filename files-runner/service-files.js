"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service_FilesLoader = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Service_FilesLoader extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.getAppModule(), "srv.js", { runFiles: true });
    }
}
exports.Service_FilesLoader = Service_FilesLoader;
