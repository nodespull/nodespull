"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route_FilesRunner = void 0;
const common_1 = require("./common");
class Route_FilesRunner extends common_1.FilesRunner {
    constructor() {
        super();
        super.recursiveRun(common_1.FilesRunner.rootPath, "delete.js");
        super.recursiveRun(common_1.FilesRunner.rootPath, "get.js");
        super.recursiveRun(common_1.FilesRunner.rootPath, "head.js");
        super.recursiveRun(common_1.FilesRunner.rootPath, "post.js");
        super.recursiveRun(common_1.FilesRunner.rootPath, "put.js");
    }
}
exports.Route_FilesRunner = Route_FilesRunner;
