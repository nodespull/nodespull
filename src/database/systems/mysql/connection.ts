import sequelize from "sequelize";
import functions_placeholders from "../../helpers/functions-placeholders"
import { db_mySQLConnectionArg } from "./model";
import { Table } from "./Table";
import { DB_Connection } from "../../models/db-connection";
import { Log } from "../../../etc/log";


export class DB_MySQL_Connection implements DB_Connection{
    final_HostAddr:string = ""
    migration = {
        isRunning: false,
        isRevertMode: false,
        rawQueries: new Array<string>() // runs after model and relations are updated
    }
    ORM:mySQL_ORM// = new mySQL_ORM({}) //placeholder

    constructor(public conf: db_mySQLConnectionArg){
        this.ORM = new mySQL_ORM(conf)
    }

    start(){
        this.ORM.interface.authenticate()
        .then(()=>{
            if(this.migration.isRunning) new Log(`migrated database '${this.conf.database}' using DAO '${this.conf.selector}'`).FgGreen().printValue()
            else console.log("- "+new Log("created link ").FgGreen().getValue()+"'"+this.conf.selector+"' "+new Log("to database ").FgGreen().getValue()+"'"+this.conf.database+"'")
        })
        .catch((e:any)=>{
            console.log("- "+new Log(`Error: failed to connect link '${this.conf.selector}' to database '${this.conf.database}'`).FgRed().getValue())
            if(e.original) new Log("  message: "+e.original.message).FgRed().printValue()
        })
    }
}


class mySQL_ORM {
    interface:sequelize.Sequelize|any;
    // private r(){}//rogue empty function for install mode
    constructor(sequelize_user_inputs:any){
        // if(isModeInstall) this.interface = {...functions_placeholders}
        this.interface = this.setup(sequelize_user_inputs)
    }

    // initialize sequelize instance for ORM
    private setup(config:any){
        // DB_Controller.final_HostAddr = (config.host?config.host:DEFAULTS.MYSQL_HOST) + (config.port?config.port:DEFAULTS.PORT);
        return new sequelize.Sequelize(
            config.database, 
            config.username,
            config.password,{
            port: config.port,
            host: config.host,
            dialect: "mysql",
            pool:{
              max: 10,
              min: 0,
              idle: 5000,
              acquire: 60000,
              evict: 1000,
            },
            dialectOptions: { connectTimeout: 60000 },
            logging: false,
            define: { 
              charset: 'utf8',
              collate: 'utf8_general_ci',
              paranoid: true
            }
        })
    }

    addTable(tableName:string, def:sequelize.ModelAttributes):Table{
        this.interface.define(tableName,def, {freezeTableName:true});
        let model = this.interface.model(tableName);
        return new Table(model);
    }
}
