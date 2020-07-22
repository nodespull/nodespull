import fs from "fs"
import { Log } from "../etc/log"
import DB_Controller from "./controller"
import {DB_FilesRunner} from "../files-runner/db-files"
import { getCurrentDBVersion } from "../cli/db/common"
import {appModule} from "../install"
import cmd from "../cli/exe/exe"
const root = appModule;


export class Migration {

    currDBVersion:number;

    constructor(arg:string){
        this.currDBVersion = getCurrentDBVersion()
        if(arg == "up") this.up()
        else if(arg == "down") this.down()
        else new Log("migration command incorrect. use 'up' or 'down'").throwError()
        
    }

    up(){
        console.log(`start database migration toward schema at 'stage.v${this.currDBVersion+1}' ..`)
        DB_Controller.migration.isRunning = true
        new DB_FilesRunner()
        DB_Controller.ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            else new Log(`migrated database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing connection ..\n")
            this.update_FileStructure_onUp()
        })
    }

    down(){
        if(this.currDBVersion == 0) return new Log("No previous database version found").throwWarn()
        if(this.currDBVersion == 1) return new Log("database already at initial version").throwWarn()
        console.log(`start database revert towards schema at 'last.v${this.currDBVersion-1}' ..`)
        DB_Controller.migration.isRunning = true
        DB_Controller.migration.isRevertMode = true
        new DB_FilesRunner()
        DB_Controller.ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            else new Log(`reverted database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing connection ..\n")
            this.update_FileStructure_onDown()
        })
    }

    private update_FileStructure_onUp(){
        if(this.currDBVersion > 1) 
            cmd("mv", [root+"/database/last.v"+(this.currDBVersion-1), root+"/database/v"+(this.currDBVersion-1)], true); // mv last.vx to vx
        if (this.currDBVersion > 0)
            cmd("mv", [root+"/database/at.v"+(this.currDBVersion), root+"/database/last.v"+(this.currDBVersion)], true); // mv at.vx to last.vx
        cmd("cp",["-r" ,root+"/database/stage.v"+(this.currDBVersion+1), root+"/database/at.v"+(this.currDBVersion+1)], true); // cp stage.vx to at.vx
        cmd("mv", [root+"/database/stage.v"+(this.currDBVersion+1), root+"/database/stage.v"+(this.currDBVersion+2)], true); // mv stage.vx to stage.vx+1
    }


    private update_FileStructure_onDown(){
        cmd("rm", ["-rf", root+"/database/stage.v"+(this.currDBVersion+1)], true); // rm stage.vx
        cmd("mv", [root+"/database/at.v"+(this.currDBVersion), root+"/database/stage.v"+(this.currDBVersion)], true); // mv at.vx to stage.vx
        cmd("mv", [root+"/database/last.v"+(this.currDBVersion-1), root+"/database/at.v"+(this.currDBVersion-1)], true); // mv last.vx to at.vx
        if(this.currDBVersion > 2)
            cmd("mv", [root+"/database/v"+(this.currDBVersion-2), root+"/database/last.v"+(this.currDBVersion-2)], true); // mv vx to last.vx
    }


}