import { FilesRunner } from "./common" ;


export class Function_FilesRunner extends FilesRunner{
    constructor(){
        super()
        super.recursiveRun(FilesRunner.rootPath, "func.js");
    }
}