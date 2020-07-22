import { FilesRunner } from "./common" ;


export class Route_FilesRunner extends FilesRunner{
    constructor(){
        super()
        super.recursiveRun(FilesRunner.rootPath, "delete.js");
        super.recursiveRun(FilesRunner.rootPath, "get.js");
        super.recursiveRun(FilesRunner.rootPath, "head.js");
        super.recursiveRun(FilesRunner.rootPath, "post.js");
        super.recursiveRun(FilesRunner.rootPath, "put.js");
    }
}