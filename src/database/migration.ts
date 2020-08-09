import { Log } from "../etc/log"
import DB_Controller from "./controller"
import {DB_Model_Rel_FilesRunner} from "../files-runner/db-model-rel-files"
import { getCurrentDBVersion } from "../cli/db/sql/common"
import cmd from "../cli/exe/exe"
import { FilesEngine } from "../files-runner/common"
import { Database } from "../server"
import stageModelTemplate from "../cli/db/sql/templates/x_stage.model"
import stageRelationTemplate from "../cli/db/sql/templates/x_stage.relation"
import { PathVar } from "../etc/other/paths"

export class Migration extends FilesEngine{

    currDBVersion:number;
    dbConnectionSelector:string;

    constructor(arg:string){
        super()
        this.currDBVersion = getCurrentDBVersion()
        let action = arg.split(" ")[0]
        this.dbConnectionSelector = arg.split(" ")[1]
        if(action == "up") this.up()
        else if(action == "down") this.down()
        else if(action == "freeze") this.inplace()
        else new Log("migration command incorrect. use 'up', 'down', or 'update'").throwError()
    }

    inplace(){
        console.log(`start database update using schema 'at.v${this.currDBVersion+1}' ..`)
        DB_Controller.connections[this.dbConnectionSelector].migration.isRunning = true // pseudo migration
        new DB_Model_Rel_FilesRunner({dbConnectionSelector:this.dbConnectionSelector})
        DB_Controller.connections[this.dbConnectionSelector].ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            for(let query of DB_Controller.connections[this.dbConnectionSelector].migration.rawQueries) 
                Database.interfaces[this.dbConnectionSelector].runRawQuery(query)
            new Log(`job ran for database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
    }

    up(){
        console.log(`start database migration toward schema 'stage.v${this.currDBVersion+1}' ..`)
        DB_Controller.connections[this.dbConnectionSelector].migration.isRunning = true
        this.update_FileStructure_onUp()
        new DB_Model_Rel_FilesRunner({dbConnectionSelector:this.dbConnectionSelector})
        DB_Controller.connections[this.dbConnectionSelector].ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            for(let query of DB_Controller.connections[this.dbConnectionSelector].migration.rawQueries) 
                Database.interfaces[this.dbConnectionSelector].runRawQuery(query)
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
        DB_Controller.connections[this.dbConnectionSelector].migration.isRunning = true
        DB_Controller.connections[this.dbConnectionSelector].migration.isRevertMode = true
        this.update_FileStructure_onDown()
        new DB_Model_Rel_FilesRunner({dbConnectionSelector:this.dbConnectionSelector})
        DB_Controller.connections[this.dbConnectionSelector].ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
            if(err) return console.log(err)
            for(let query of DB_Controller.connections[this.dbConnectionSelector].migration.rawQueries) 
                Database.interfaces[this.dbConnectionSelector].runRawQuery(query)
            new Log(`job ran for database '${res.config.database}'`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
    }

    private update_FileStructure_onUp(){
        if(this.currDBVersion >= 2) 
            cmd("mv", [
                PathVar.dbModule+"/"+this.dbConnectionSelector+"/archives/last.v"+(this.currDBVersion-1), 
                PathVar.dbModule+"/"+this.dbConnectionSelector+"/archives/v"+(this.currDBVersion-1)], true); // mv last.vx to vx
        if (this.currDBVersion >= 1)
            cmd("mv", [
                PathVar.dbModule+"/"+this.dbConnectionSelector+"/at.v"+(this.currDBVersion), 
                PathVar.dbModule+"/"+this.dbConnectionSelector+"/archives/last.v"+(this.currDBVersion)], true); // mv at.vx to last.vx
        cmd("cp",[
            "-r" ,PathVar.dbModule+"/"+this.dbConnectionSelector+"/stage.v"+(this.currDBVersion+1), 
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/at.v"+(this.currDBVersion+1)], true); // cp stage.vx to at.vx
        cmd("mv", [
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/stage.v"+(this.currDBVersion+1), 
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/stage.v"+(this.currDBVersion+2)], true); // mv stage.vx to stage.v(x+1)
        new DB_Model_Rel_FilesRunner({overwrite_newStageScripts:true, dbConnectionSelector:this.dbConnectionSelector})
    }

    private update_FileStructure_onDown(){
        cmd("rm", ["-rf", PathVar.dbModule+"/"+this.dbConnectionSelector+"/stage.v"+(this.currDBVersion+1)], true); // rm stage.vx
        cmd("mv", [
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/at.v"+(this.currDBVersion), 
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/stage.v"+(this.currDBVersion)], true); // mv at.vx to stage.vx
        cmd("mv", [
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/archives/last.v"+(this.currDBVersion-1), 
            PathVar.dbModule+"/"+this.dbConnectionSelector+"/at.v"+(this.currDBVersion-1)], true); // mv last.vx to at.vx
        if(this.currDBVersion >= 3)
            cmd("mv", [
                PathVar.dbModule+"/"+this.dbConnectionSelector+"/archives/v"+(this.currDBVersion-2), 
                PathVar.dbModule+"/"+this.dbConnectionSelector+"/archives/last.v"+(this.currDBVersion-2)], true); // mv vx to last.vx
    }


}


