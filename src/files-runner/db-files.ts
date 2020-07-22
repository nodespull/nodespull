import fs from "fs"
import { FilesRunner } from "./common" ;
import DB_Controller from "../database/controller";
import { Log } from "../etc/log";

export class DB_FilesRunner extends FilesRunner{

    constructor(){
        super()

        if(DB_Controller.migration.isRunning) {
            let targetFolderPath:string|undefined
            if(DB_Controller.migration.isRevertMode) targetFolderPath = this.getFolderPath(FilesRunner.rootPath, "at.v") // migration down scripts are in this folder
            else targetFolderPath = this.getFolderPath(FilesRunner.rootPath, "stage.v") // migration up are here

            if(!targetFolderPath) 
                new Log(`missing folder with prefix '${DB_Controller.migration.isRevertMode?"at.v":"stage.v"}' in '${FilesRunner.rootPath.split("/").slice(-2)[0]}' directory tree`).throwError()
            else{
                super.recursiveRun(targetFolderPath, "model.js");
                super.recursiveRun(targetFolderPath, "relation.js");
            }
        }
        else{
            super.recursiveRun(FilesRunner.rootPath, "model.js");
            super.recursiveRun(FilesRunner.rootPath, "relation.js");
        }
    }

    /**
     * search for path to at.vX or stage.vX directory and return it for recursiveRun
     */
    getFolderPath(path:string, folderNamePrefix:string):string|undefined{
        try {
            if(path.split("/").pop() && path.split("/").pop()!.startsWith(folderNamePrefix)) return path
            const dirents = fs.readdirSync(path, { withFileTypes: true });
            const folderNames:string[] = dirents
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name)
            let res:string|undefined
            for(let folderName of folderNames) res = res || this.getFolderPath(path+"/"+folderName, folderNamePrefix)
            return res
        }
        catch{ return }
    }

} 
