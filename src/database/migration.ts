import { Log } from "../etc/log"
import DB_Controller from "./controller"
import {DB_FilesRunner} from "../files-runner/db-files"
import { getCurrentDBVersion } from "../cli/db/sql/common"
import {appModule, dbModule} from "../install"
import cmd from "../cli/exe/exe"
import { FilesEngine } from "../files-runner/common"
import { Database } from "../server"
import stageModelTemplate from "../cli/db/sql/templates/stage.model"
import stageRelationTemplate from "../cli/db/sql/templates/stage.relation"

const dbRoot = appModule;


export class Migration extends FilesEngine{

    currDBVersion:number;

    constructor(arg:string){
        super()
        this.currDBVersion = getCurrentDBVersion()
        if(arg == "up") this.up()
        else if(arg == "down") this.down()
        else if(arg == "freeze") this.inplace()
        else new Log("migration command incorrect. use 'up', 'down', or 'update'").throwError()
    }

    inplace(){
        console.log(`start database update using schema 'at.v${this.currDBVersion+1}' ..`)
        DB_Controller.migration.isRunning = true // pseudo migration
        new DB_FilesRunner()
        DB_Controller.ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            for(let query of DB_Controller.migration.rawQueries) Database.runRawQuery(query)
            new Log(`job ran for database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
    }

    up(){
        console.log(`start database migration toward schema 'stage.v${this.currDBVersion+1}' ..`)
        DB_Controller.migration.isRunning = true
        this.update_FileStructure_onUp()
        new DB_FilesRunner()
        DB_Controller.ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            for(let query of DB_Controller.migration.rawQueries) Database.runRawQuery(query)
            new Log(`job ran for database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
    }

    down(){
        if(this.currDBVersion == 0){
            new Log("No previous database version found").throwWarn()
            process.exit(1)
        }
        if(this.currDBVersion == 1) {
            new Log("database already at initial version").throwWarn()
            process.exit(1)
        }
        console.log(`start database revert towards schema 'archives/last.v${this.currDBVersion-1}' ..`)
        DB_Controller.migration.isRunning = true
        DB_Controller.migration.isRevertMode = true
        this.update_FileStructure_onDown()
        new DB_FilesRunner()
        DB_Controller.ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            for(let query of DB_Controller.migration.rawQueries) Database.runRawQuery(query)
            new Log(`job ran for database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
    }

    private update_FileStructure_onUp(){
        if(this.currDBVersion >= 2) 
            cmd("mv", [dbRoot+"/SQL/archives/last.v"+(this.currDBVersion-1), dbRoot+"/SQL/archives/v"+(this.currDBVersion-1)], true); // mv last.vx to vx
        if (this.currDBVersion >= 1)
            cmd("mv", [dbRoot+"/SQL/at.v"+(this.currDBVersion), dbRoot+"/SQL/archives/last.v"+(this.currDBVersion)], true); // mv at.vx to last.vx
        cmd("cp",["-r" ,dbRoot+"/SQL/stage.v"+(this.currDBVersion+1), dbRoot+"/SQL/at.v"+(this.currDBVersion+1)], true); // cp stage.vx to at.vx
        cmd("mv", [dbRoot+"/SQL/stage.v"+(this.currDBVersion+1), dbRoot+"/SQL/stage.v"+(this.currDBVersion+2)], true); // mv stage.vx to stage.v(x+1)
        new DB_FilesRunner({overwrite_newStageScripts:true})
    }

    private update_FileStructure_onDown(){
        cmd("rm", ["-rf", dbRoot+"/SQL/stage.v"+(this.currDBVersion+1)], true); // rm stage.vx
        cmd("mv", [dbRoot+"/SQL/at.v"+(this.currDBVersion), dbRoot+"/SQL/stage.v"+(this.currDBVersion)], true); // mv at.vx to stage.vx
        cmd("mv", [dbRoot+"/SQL/archives/last.v"+(this.currDBVersion-1), dbRoot+"/SQL/at.v"+(this.currDBVersion-1)], true); // mv last.vx to at.vx
        if(this.currDBVersion >= 3)
            cmd("mv", [dbRoot+"/SQL/archives/v"+(this.currDBVersion-2), dbRoot+"/SQL/archives/last.v"+(this.currDBVersion-2)], true); // mv vx to last.vx
    }


}


