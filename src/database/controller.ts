import sequelize from "sequelize";
import { DatabaseTools } from "./tools";
import { Table } from "./Table";
import functions_placeholders from "./etc/functions-placeholders"



let DEFAULTS = {
    MYSQL_ROOT_USERNAME:"root",
    MYSQL_ROOT_PASSWORD: "nodespull-db-password",
    MYSQL_DATABASE: "nodespull-db-database",
    MYSQL_HOST:"localhost", // if started in a container, make sure to use "nodespull-db-server"
    PORT: "3333"
}

export default class DB_Controller{
    static final_HostAddr = ""
    static isRunningMigration = false

    static ORM:ORM;
    static userConfig:any;
    static setup(isModeInstall:boolean, dbTools?:DatabaseTools){
        DB_Controller.ORM = !isModeInstall?new ORM(false,dbTools?dbTools.config:undefined):new ORM(true,{});
    }
    static connect(){
        if(this.isRunningMigration) console.log("Database migration complete")
        else this.ORM.interface.sync({alter:true}).then(()=>{
            console.log("Database Connection Established");
        })
    }
}


class ORM {
    interface:sequelize.Sequelize|any;
    private r(){}//rogue empty function for install mode
    constructor(isModeInstall:boolean,sequelize_user_inputs?:any){
        if(isModeInstall) this.interface = {...functions_placeholders}
        else this.interface = this.setup(sequelize_user_inputs?sequelize_user_inputs:{});
    }

    // initialize sequelize instance for ORM
    private setup(config:any){
        DB_Controller.final_HostAddr = (config.host?config.host:DEFAULTS.MYSQL_HOST) + (config.port?config.port:DEFAULTS.PORT);
        return new sequelize.Sequelize(
            config.database?config.database:DEFAULTS.MYSQL_DATABASE, 
            config.username?config.username:DEFAULTS.MYSQL_ROOT_USERNAME,
            config.password?config.password:DEFAULTS.MYSQL_ROOT_PASSWORD,{
            port: config.port?config.port:DEFAULTS.PORT,
            host: config.host?config.host:DEFAULTS.MYSQL_HOST,
            dialect: config.dialect?config.dialect:"mysql",
            pool:config.pool?config.pool:{
              max: 10,
              min: 0,
              idle: 5000,
              acquire: 60000,
              evict: 1000,
            },
            dialectOptions: config.dialectOptions?config.dialectOptions:{ connectTimeout: 60000 },
            logging: false,
            define: config.define?config.define:{ 
              charset: 'utf8',
              collate: 'utf8_general_ci',
              paranoid: config.paranoid?config.paranoid:false // for now, we delete permanently - until we review db dependencies
            }
        })
    }

    addTable(tableName:string, def:sequelize.ModelAttributes):Table{
        this.interface.define(tableName,def, {freezeTableName:true});
        let model = DB_Controller.ORM.interface.model(tableName);
        return new Table(model);
    }
}


export enum dbConnectionType{
    /**
     * add new tables or alter existing ones.
     */
    alter,
    /**
     * delete and rebuild schema to match model. All data is lost.
     */
    reset,
    /**
     * add new tables, do not modify existing ones
     */
    addOnly
}