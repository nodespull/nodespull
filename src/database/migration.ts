import { Log } from "../etc/log"
import {DatabaseConnectionController} from "./connection"
import {DB_Model_Rel_FilesLoader} from "../files-runner/db-model-rel-files"
import { getCurrentDBVersion } from "./helpers/common"
import cmd from "../cli/exe/exe"
import { FilesEngine } from "../files-runner/common"
// import stageModelTemplate from "../cli/database/table/templates/x_stage.model"
// import stageRelationTemplate from "../cli/database/table/templates/x_stage.relation"
import { PathVar } from "../etc/other/paths"
import { DatabaseUserInterfaceController } from "./user-interface"

export class Migration extends FilesEngine{

    currDBVersion:number;
    dbConnectionSelector:string;

    dbPath:string;

    constructor(action:string, dbConnectionSelector:string, public readonly:boolean, public freeze:boolean){
        super()
        this.dbConnectionSelector = dbConnectionSelector
        if(!Object.keys(DatabaseConnectionController.connections).includes(dbConnectionSelector)) {
            new Log(`link '${dbConnectionSelector}' not found`).FgRed().printValue()
            process.exit(1)
        }
            
        this.dbPath = this.dbConnectionSelector+"-db"
        this.currDBVersion = getCurrentDBVersion(this.dbConnectionSelector)
        if(action == "up") this.up()
        else if(action == "down") this.down()
        else new Log("migration command incorrect. use 'up', 'down', or 'update'").throwError()
    }

    // inplace(){
    //     console.log(`\nstart database update using schema 'at.v${this.currDBVersion+1}' ..`)
    //     DatabaseConnectionController.connections[this.dbConnectionSelector].migration.isRunning = true // pseudo migration
    //     new DB_Model_Rel_FilesLoader({dbConnectionSelector:this.dbConnectionSelector})
    //     if(this.readonly) DatabaseConnectionController.connections[this.dbConnectionSelector].ORM.interface.authenticate().then((res:any, err:any)=>{
    //         if(err) return console.log(err)
    //         for(let query of DatabaseConnectionController.connections[this.dbConnectionSelector].migration.rawQueries) 
    //         DatabaseUserInterfaceController.interfaces[this.dbConnectionSelector].runRawQuery(query)
    //         new Log(`updated models for link '${this.dbConnectionSelector}' with no database ${this.freeze?"and version ":""}change`).FgGreen().printValue()
    //         console.log("closing migration job ..\n")
    //     })
    //     else DatabaseConnectionController.connections[this.dbConnectionSelector].ORM.interface.sync({alter:true}).then((res:any, err:any)=>{
    //         for(let query of DatabaseConnectionController.connections[this.dbConnectionSelector].migration.rawQueries) 
    //         DatabaseUserInterfaceController.interfaces[this.dbConnectionSelector].runRawQuery(query)
    //         new Log(`job ran for database '${res.config.database}' with link '${this.dbConnectionSelector}'`).FgGreen().printValue()
    //         console.log("closing migration job ..\n")
    //     })
    // }

    async up(){
        this.currDBVersion = getCurrentDBVersion(this.dbConnectionSelector)
        console.log(`\nstart migration toward schema 'stage.v${this.currDBVersion+1}' ..`)
        DatabaseConnectionController.connections[this.dbConnectionSelector].migration.isRunning = true
        if(!this.freeze) this.update_FileStructure_onUp()
        new DB_Model_Rel_FilesLoader({dbConnectionSelector:this.dbConnectionSelector})
        if(this.freeze) this.update_FileStructure_frozen()
        if(this.readonly) DatabaseConnectionController.connections[this.dbConnectionSelector].ORM.interface.authenticate().then((res:any, err:any)=>{
            for(let query of DatabaseConnectionController.connections[this.dbConnectionSelector].migration.rawQueries)
                DatabaseUserInterfaceController.interfaces[this.dbConnectionSelector].runRawQuery(query).then((val:any)=>{
                    if(val[1] == null) return
                    new Log("Error: "+val[1].sqlMessage+" at '"+val[1].sql+"'").FgRed().printValue()
                    new Log("\nError with raw queries: manual fix required.\n* Remove raw queries for relevant model in 'at.v"+(this.currDBVersion+1)+"', then migrate down.").FgYellow().printValue()
                    console.log("terminating check ..")
                })
            new Log(`updated models for link '${this.dbConnectionSelector}' with no database ${this.freeze?"and version ":""}change`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
        else DatabaseConnectionController.connections[this.dbConnectionSelector].ORM.interface.sync({alter:true}).then((res:any)=>{
            for(let query of DatabaseConnectionController.connections[this.dbConnectionSelector].migration.rawQueries)
                DatabaseUserInterfaceController.interfaces[this.dbConnectionSelector].runRawQuery(query).then((val:any)=>{
                    if(val[1] == null) return
                    new Log("Error: "+val[1].sqlMessage+" at '"+val[1].sql+"'").FgRed().printValue()
                    new Log("\nError with raw queries: manual fix required.\n* Remove raw queries for relevant model in 'at.v"+(this.currDBVersion+1)+"', then migrate down.").FgYellow().printValue()
                    console.log("terminating check ..")
                })
            new Log(`job ran for database '${res.config.database}' with link '${this.dbConnectionSelector}'${this.freeze?" with no version change":""}`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
        .catch((e:any)=>{
            if(!this.freeze) this.update_FileStructure_onDown() //alter failed, fix file structure
            new Log("Error: "+e.original.sqlMessage).FgRed().printValue()
            new Log("critical Error found. migration Aborted.").FgYellow().printValue()
            console.log("closing migration job ..\n")
        })
    }

    down(){
        this.currDBVersion = getCurrentDBVersion(this.dbConnectionSelector)
        if(this.currDBVersion == 0){
            new Log("No previous database version found").throwWarn()
            process.exit(1)
        }
        if(this.currDBVersion == 1) {
            new Log("database already at initial version").throwWarn()
            process.exit(1)
        }
        console.log(`\nstart revert towards schema 'archives/last.v${this.currDBVersion-1}' ..`)
        DatabaseConnectionController.connections[this.dbConnectionSelector].migration.isRunning = true
        DatabaseConnectionController.connections[this.dbConnectionSelector].migration.isRevertMode = true
        if(!this.freeze) this.update_FileStructure_onDown()
        new DB_Model_Rel_FilesLoader({dbConnectionSelector:this.dbConnectionSelector})
        if(this.freeze) this.update_FileStructure_frozen()
        if(this.readonly) DatabaseConnectionController.connections[this.dbConnectionSelector].ORM.interface.authenticate().then((res:any)=>{
            for(let query of DatabaseConnectionController.connections[this.dbConnectionSelector].migration.rawQueries)
                DatabaseUserInterfaceController.interfaces[this.dbConnectionSelector].runRawQuery(query).then((val:any)=>{
                    if(val[1] == null) return
                    new Log("Error: "+val[1].sqlMessage+" at '"+val[1].sql+"'").FgRed().printValue()
                    new Log("\nError with raw queries: manual fix required.\n* Repair raw queries for relevant model in 'stage.v"+(this.currDBVersion)+"'").FgYellow().printValue()
                    console.log("terminating check ..")
                })
            new Log(`updated models for link '${this.dbConnectionSelector}' with no database ${this.freeze?"and version ":""}change`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
        else DatabaseConnectionController.connections[this.dbConnectionSelector].ORM.interface.sync({alter:true}).then((res:any)=>{
            for(let query of DatabaseConnectionController.connections[this.dbConnectionSelector].migration.rawQueries)
                DatabaseUserInterfaceController.interfaces[this.dbConnectionSelector].runRawQuery(query).then((val:any)=>{
                    if(val[1] == null) return
                    new Log("Error: "+val[1].sqlMessage+" at '"+val[1].sql+"'").FgRed().printValue()
                    new Log("\nError with raw queries: manual fix required.\n* Repair raw queries for relevant model in 'stage.v"+(this.currDBVersion)+"'").FgYellow().printValue()
                    console.log("terminating check ..")
                })
            new Log(`job ran for database '${res.config.database}' using link '${this.dbConnectionSelector}'${this.freeze?" with no version change":""}`).FgGreen().printValue()
            console.log("closing migration job ..\n")
        })
        .catch((e:any)=>{
            if(!this.freeze) this.update_FileStructure_onUp()//alter failed, fix file structure
            new Log("Error: "+e.original.sqlMessage).FgRed().printValue()
            new Log("critical Error found. migration Aborted.").FgYellow().printValue()
            console.log("closing migration job ..\n")
        })
    }

    private update_FileStructure_onUp(){
        this.currDBVersion = getCurrentDBVersion(this.dbConnectionSelector)
        if(this.currDBVersion >= 2) 
            cmd("mv", [
                PathVar.getDbModule()+"/"+this.dbPath+"/archives/last.v"+(this.currDBVersion-1), 
                PathVar.getDbModule()+"/"+this.dbPath+"/archives/v"+(this.currDBVersion-1)], true); // mv last.vx to vx
        if (this.currDBVersion >= 1)
            cmd("mv", [
                PathVar.getDbModule()+"/"+this.dbPath+"/at.v"+(this.currDBVersion), 
                PathVar.getDbModule()+"/"+this.dbPath+"/archives/last.v"+(this.currDBVersion)], true); // mv at.vx to last.vx
        cmd("cp",[
            "-r" ,PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(this.currDBVersion+1), 
            PathVar.getDbModule()+"/"+this.dbPath+"/at.v"+(this.currDBVersion+1)], true); // cp stage.vx to at.vx
        cmd("mv", [
            PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(this.currDBVersion+1), 
            PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(this.currDBVersion+2)], true); // mv stage.vx to stage.v(x+1)
        new DB_Model_Rel_FilesLoader({overwrite_newStageScripts:true, dbConnectionSelector:this.dbConnectionSelector})
    }

    private update_FileStructure_onDown(){
        this.currDBVersion = getCurrentDBVersion(this.dbConnectionSelector)
        cmd("rm", ["-rf", PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(this.currDBVersion+1)], true); // rm stage.vx
        cmd("mv", [
            PathVar.getDbModule()+"/"+this.dbPath+"/at.v"+(this.currDBVersion), 
            PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(this.currDBVersion)], true); // mv at.vx to stage.vx
        cmd("mv", [
            PathVar.getDbModule()+"/"+this.dbPath+"/archives/last.v"+(this.currDBVersion-1), 
            PathVar.getDbModule()+"/"+this.dbPath+"/at.v"+(this.currDBVersion-1)], true); // mv last.vx to at.vx
        if(this.currDBVersion >= 3)
            cmd("mv", [
                PathVar.getDbModule()+"/"+this.dbPath+"/archives/v"+(this.currDBVersion-2), 
                PathVar.getDbModule()+"/"+this.dbPath+"/archives/last.v"+(this.currDBVersion-2)], true); // mv vx to last.vx
    }


    private update_FileStructure_frozen(){
        this.currDBVersion = getCurrentDBVersion(this.dbConnectionSelector)
        cmd("rm", ["-rf", PathVar.getDbModule()+"/"+this.dbPath+"/at.v"+(this.currDBVersion)], true); // rm at.vx
        cmd("cp", [ "-r",
            PathVar.getDbModule()+"/"+this.dbPath+"/stage.v"+(this.currDBVersion+1),
            PathVar.getDbModule()+"/"+this.dbPath+"/at.v"+(this.currDBVersion)], true); // cp stage into at
    }
}


