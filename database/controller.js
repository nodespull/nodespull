"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import sequelize from "sequelize";
// import { DatabaseTools } from "./tools";
// import { Table } from "./Table";
// import functions_placeholders from "./etc/functions-placeholders"
const connection_1 = require("./systems/mysql/connection");
const log_1 = require("../etc/log");
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
let DB_Controller = /** @class */ (() => {
    class DB_Controller {
        static openMySQLConnection(conf) {
            let con = new connection_1.DB_MySQL_Connection(conf);
            if (Object.keys(DB_Controller.connections).includes(conf.selector))
                new log_1.Log(`duplicate database selector '${conf.selector}'`).throwError();
            DB_Controller.connections[conf.selector] = con;
        }
    }
    DB_Controller.connections = {};
    return DB_Controller;
})();
exports.default = DB_Controller;
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
