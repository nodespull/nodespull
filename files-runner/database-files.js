"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database_FilesLoader = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Database_FilesLoader extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.getDbModule(), "database.js", { runFiles: true });
    }
}
exports.Database_FilesLoader = Database_FilesLoader;
