import fs from "fs"
import { FilesEngine } from "./common" ;
import DB_Controller from "../database/controller";
import { Log } from "../etc/log";
import { Database } from "../server"
import { Relations } from "../database/tools"
import { getCurrentDBVersion } from "../cli/db/common";
import stageModelTemplate from "../cli/db/templates/stage.model";
import stageRelationTemplate from "../cli/db/templates/stage.relation";

export class DB_FilesRunner extends FilesEngine{

    tableNames_definitions_map:{[tableName:string]:any} = {} // used to store the "at.vx" definitions and update "stage.vx" files
    tableNames_relations_map:{[tableName:string]:any} = {}

    constructor(option?:DB_FilesRunner_option){
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
        if(DB_Controller.migration.isRunning && option && option.overwrite_newStageScripts) this.updateStageFiles()
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



    /**
     * update stage files with scripts from 'at.vx'
    */
    updateStageFiles(){
        let modelPaths = super.recursiveSearch(FilesEngine.rootPath+"/database/stage.v"+(getCurrentDBVersion()+1)+"/","model.js",{runFiles:false})
        let relPaths = super.recursiveSearch(FilesEngine.rootPath+"/database/stage.v"+(getCurrentDBVersion()+1)+"/","relation.js",{runFiles:false})
        for(let path of modelPaths){
            let tableName = path.split("/").splice(-1)[0].split(".")[0]
            let modelFile = fs.readFileSync(path,'utf8')
            let tempReg = modelFile.match(/(    | )Database.defineModel\(([\s\S]*?)}\)/)
            let modelFile_extract:string|null = tempReg?tempReg[0]:null
            fs.writeFileSync(path, stageModelTemplate(modelFile_extract))
        }
        for(let path of relPaths){
            let tableName = path.split("/").splice(-1)[0].split(".")[0]
            let modelFile = fs.readFileSync(path,'utf8')
            let tempReg = modelFile.match(/(    | )Relations.set\(([\s\S]*?)}\)/)
            let modelFile_extract:string|null = tempReg?tempReg[0]:null
            fs.writeFileSync(path, stageRelationTemplate(modelFile_extract))
        }
    }

} 


interface DB_FilesRunner_option {
    overwrite_newStageScripts: boolean //overwrite onUpload and onRevert with declarative_onUpload (defineModel) statement
}