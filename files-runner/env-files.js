"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env_FilesLoader = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Env_FilesLoader extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.getProcessEnv(), "env.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.getAppEnvModule(), "env.js", { runFiles: true });
    }
}
exports.Env_FilesLoader = Env_FilesLoader;
