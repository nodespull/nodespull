"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth_FilesLoader = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Auth_FilesLoader extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.src + "/auth", "jwt.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.src + "/auth", "oauth2.js", { runFiles: true });
    }
}
exports.Auth_FilesLoader = Auth_FilesLoader;
