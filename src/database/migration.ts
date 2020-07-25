import fs from "fs"
import { Log } from "../etc/log"
import DB_Controller from "./controller"
import {DB_FilesRunner} from "../files-runner/db-files"
import { getCurrentDBVersion } from "../cli/db/common"
import {appModule} from "../install"
import cmd from "../cli/exe/exe"
import { FilesEngine } from "../files-runner/common"
import { Database } from "../server"
import stageModelTemplate from "../cli/db/templates/stage.model"
import stageRelationTemplate from "../cli/db/templates/stage.relation"

const root = appModule;


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
            cmd("mv", [root+"/database/archives/last.v"+(this.currDBVersion-1), root+"/database/archives/v"+(this.currDBVersion-1)], true); // mv last.vx to vx
        if (this.currDBVersion >= 1)
            cmd("mv", [root+"/database/at.v"+(this.currDBVersion), root+"/database/archives/last.v"+(this.currDBVersion)], true); // mv at.vx to last.vx
        cmd("cp",["-r" ,root+"/database/stage.v"+(this.currDBVersion+1), root+"/database/at.v"+(this.currDBVersion+1)], true); // cp stage.vx to at.vx
        cmd("mv", [root+"/database/stage.v"+(this.currDBVersion+1), root+"/database/stage.v"+(this.currDBVersion+2)], true); // mv stage.vx to stage.v(x+1)
    }

    private update_FileStructure_onDown(){
        cmd("rm", ["-rf", root+"/database/stage.v"+(this.currDBVersion+1)], true); // rm stage.vx
        cmd("mv", [root+"/database/at.v"+(this.currDBVersion), root+"/database/stage.v"+(this.currDBVersion)], true); // mv at.vx to stage.vx
        cmd("mv", [root+"/database/archives/last.v"+(this.currDBVersion-1), root+"/database/at.v"+(this.currDBVersion-1)], true); // mv last.vx to at.vx
        if(this.currDBVersion >= 3)
            cmd("mv", [root+"/database/archives/v"+(this.currDBVersion-2), root+"/database/archives/last.v"+(this.currDBVersion-2)], true); // mv vx to last.vx
    }


}


