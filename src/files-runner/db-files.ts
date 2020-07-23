import fs from "fs"
import { FilesEngine } from "./common" ;
import DB_Controller from "../database/controller";
import { Log } from "../etc/log";

export class DB_FilesRunner extends FilesEngine{

    constructor(){
        super()

        if(DB_Controller.migration.isRunning) {
            let targetFolderPath:string|undefined
            if(DB_Controller.migration.isRevertMode) targetFolderPath = this.getFolderPath(FilesEngine.rootPath, "stage.v") // migration down scripts are in this folder
            else targetFolderPath = this.getFolderPath(FilesEngine.rootPath, "at.v") // migration up are here

            if(!targetFolderPath) 
                new Log(`missing folder with prefix '${DB_Controller.migration.isRevertMode?"stage.v":"at.v"}' in '${FilesEngine.rootPath.split("/").slice(-2)[0]}' directory tree`).throwError()
            else{
                super.recursiveSearch(targetFolderPath, "model.js", {runFiles:true});
                super.recursiveSearch(targetFolderPath, "relation.js", {runFiles:true});
            }
        }
        else{
            super.recursiveSearch(FilesEngine.rootPath, "model.js", {runFiles:true});
            super.recursiveSearch(FilesEngine.rootPath, "relation.js", {runFiles:true});
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
