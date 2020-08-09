// import sequelize from "sequelize";
// import { DatabaseTools } from "./tools";
// import { Table } from "./Table";
// import functions_placeholders from "./etc/functions-placeholders"
import { DB_MySQL_Connection } from "./systems/mysql/connection";
import { db_mySQLConnectionArg } from "./systems/mysql/model";
import { Log } from "../etc/log";



// let DEFAULTS = {
//     MYSQL_ROOT_USERNAME:"root",
//     MYSQL_ROOT_PASSWORD: "nodespull-db-password",
//     MYSQL_DATABASE: "nodespull-db-database",
//     MYSQL_HOST:"localhost", // if started in a container, make sure to use "nodespull-db-server"
//     PORT: "3333"
// }

// export default class DB_Controller{
//     static final_HostAddr = ""
//     static migration = {
//         isRunning: false,
//         isRevertMode: false,
//         rawQueries: new Array<string>() // runs after model and relations are updated
//     }


//     static ORM:ORM;
//     static userConfig:any;
//     static setup(isModeInstall:boolean, dbTools?:DatabaseTools){
//         DB_Controller.ORM = !isModeInstall?new ORM(false,dbTools?dbTools.config:undefined):new ORM(true,{});
//     }
//     static connect(){
//         this.ORM.interface.sync({alter:true}).then(()=>{
//             if(this.migration.isRunning) console.log("Database migration complete")
//             else console.log("Database Connection Established");
//         })
//     }
// }

export default class DB_Controller {
    static connections:{[dbName:string]:DB_MySQL_Connection} = {}
    static openMySQLConnection(conf:db_mySQLConnectionArg){
        let con = new DB_MySQL_Connection(conf)
        if(Object.keys(DB_Controller.connections).includes(conf.selector)) new Log(`duplicate database selector '${conf.selector}'`).throwError()
        DB_Controller.connections[conf.selector] = con
    }
}


// export enum dbConnectionType{
//     /**
//      * add new tables or alter existing ones.
//      */
//     alter,
//     /**
//      * delete and rebuild schema to match model. All data is lost.
//      */
//     reset,
//     /**
//      * add new tables, do not modify existing ones
//      */
//     addOnly
// }