import fs from "fs"
import { FilesEngine } from "./common" ;
import {DatabaseConnectionController} from "../database/connection";
import { Log } from "../etc/log";
import { getCurrentDBVersion } from "../database/helpers/common";
import stageModelTemplate from "../cli/link/database/table/templates/stage.attribute";
import stageRelationTemplate from "../cli/link/database/table/templates/stage.relation";
import { PathVar } from "../etc/other/paths"

export class DB_Model_Rel_FilesLoader extends FilesEngine{

    static isLoaded:boolean = false
    static load(){
        if(DB_Model_Rel_FilesLoader.isLoaded) return
        new DB_Model_Rel_FilesLoader({dbConnectionSelector:null})
        // DB_Model_Rel_FilesLoader.isLoaded = true
    }


    tableNames_definitions_map:{[tableName:string]:any} = {} // used to store the "at.vx" definitions and update "stage.vx" files
    tableNames_relations_map:{[tableName:string]:any} = {}
    dbPath:string = ""

    constructor(public args:DB_FilesRunner_option){
        super()
        if(args.dbConnectionSelector && DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRunning) {
            this.dbPath = args.dbConnectionSelector+"-db"
            let targetFolderPath:string|undefined
            if(DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRevertMode) targetFolderPath = this.getFolderPath(PathVar.getDbModule()+"/"+this.dbPath, "stage.v") // migration down scripts are in this folder
            else targetFolderPath = this.getFolderPath(PathVar.getDbModule()+"/"+this.dbPath, "at.v") // migration up are here

            if(!targetFolderPath) 
                new Log(`missing folder with prefix '${DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRevertMode?
                    "stage.v":"at.v"}' in '${PathVar.getDbModule().split("/").slice(-2).join("/")}' directory tree`).throwError()
            else{
                super.recursiveSearch(targetFolderPath, "attribute.js", {runFiles:true});
                super.recursiveSearch(targetFolderPath, "relation.js", {runFiles:true});
            }
            if(args && DatabaseConnectionController.connections[args.dbConnectionSelector].migration.isRunning && args.overwrite_newStageScripts) this.updateStageFiles()
        }
        else{
            const dbFolderPaths:string[] = fs.readdirSync(PathVar.getDbModule()+"/"+this.dbPath, { withFileTypes: true })
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            for(let dbFolderPath of dbFolderPaths){
                let targetFolderPath = this.getFolderPath(PathVar.getDbModule()+"/"+this.dbPath+"/"+dbFolderPath, "at.v")
                if(!targetFolderPath) return //throw new Log("missing folder with prefix 'at.v' in "+dbFolderPath).getValue()
                super.recursiveSearch(targetFolderPath, "attribute.js", {runFiles:true});
                super.recursiveSearch(targetFolderPath, "relation.js", {runFiles:true});
            }
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
        let modelPaths = super.recursiveSearch(PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(getCurrentDBVersion(this.args.dbConnectionSelector!)+1)+"/","attribute.js",{runFiles:false})
        let relPaths = super.recursiveSearch(PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(getCurrentDBVersion(this.args.dbConnectionSelector!)+1)+"/","relation.js",{runFiles:false})
        for(let path of modelPaths){
            let tableName = path.split("/").splice(-1)[0].split(".")[0]
            let modelFile = fs.readFileSync(path,'utf8')
            let tempReg = modelFile.match(/(    | )Database.defineModel\(([\s\S]*?)}\)/)
            let modelFile_extract:string|null = tempReg?tempReg[0]:null
            fs.writeFileSync(path, stageModelTemplate(modelFile_extract, this.args.dbConnectionSelector!))
        }
        for(let path of relPaths){
            let tableName = path.split("/").splice(-1)[0].split(".")[0]
            let modelFile = fs.readFileSync(path,'utf8')
            let tempReg = modelFile.match(/(    | )Relations.set\(([\s\S]*?)}\)/)
            let modelFile_extract:string|null = tempReg?tempReg[0]:null
            fs.writeFileSync(path, stageRelationTemplate(modelFile_extract, this.args.dbConnectionSelector!))
        }
    }

} 


interface DB_FilesRunner_option {
    //modify the content of the newly generated stage.vx to replace the onRevert function def
    overwrite_newStageScripts?: boolean //overwrite onUpload and onRevert with declarative_onUpload (defineModel) statement
    dbConnectionSelector: string|null
}