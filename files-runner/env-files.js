"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env_FilesRunner = void 0;
const common_1 = require("./common");
const paths_1 = require("../etc/other/paths");
class Env_FilesRunner extends common_1.FilesEngine {
    constructor() {
        super();
        super.recursiveSearch(paths_1.PathVar.processEnv, "env.js", { runFiles: true });
        super.recursiveSearch(paths_1.PathVar.appEnvModule, "env.js", { runFiles: true });
    }
}
exports.Env_FilesRunner = Env_FilesRunner;
