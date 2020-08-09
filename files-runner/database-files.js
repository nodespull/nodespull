"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database_FilesRunner = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Database_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.dbModule, "database.js", { runFiles: true });
    }
}
exports.Database_FilesRunner = Database_FilesRunner;
