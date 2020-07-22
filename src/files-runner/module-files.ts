import { FilesRunner } from "./common" ;


export class Module_FilesRunner extends FilesRunner{
    constructor(){
        super()
        super.recursiveRun(FilesRunner.rootPath, "module.js");

    }
}