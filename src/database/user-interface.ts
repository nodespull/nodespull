
import { DataTypes } from "sequelize";
import { TableRelation } from "./systems/mysql/Table";
import {DatabaseConnectionController} from "./connection";
import { DatabaseUserPortal_mySQL } from "./systems/mysql/user-interface";
import { Log } from "../etc/log";
import sequelize from "sequelize";


export class DatabaseUserInterfaceController {

    static interfaces:{[connSelector:string]:DatabaseUserPortalInterface} = {}

    // add interface at the same time that a dbConnection is added
    static addUserInterfaceForDBConnection(connSelector:string){
        if(!Object.keys(DatabaseUserInterfaceController.interfaces).includes(connSelector)) {
            let con = DatabaseConnectionController.connections[connSelector]
            switch(con.conf.system){
                case("mySQL"): {
                    DatabaseUserInterfaceController.interfaces[connSelector] = new DatabaseUserPortal_mySQL(connSelector)
                    break
                }
                default: new Log(`db-connection's user-interface could not be created; unsuported system '${con.conf.system}' for database '${con.conf.selector}'`).throwError()
            }
        }
    }
    static getUserInterfaceForDBConnection(dbConnectionSelector:string){
        if(!Object.keys(DatabaseUserInterfaceController.interfaces).includes(dbConnectionSelector)) new Log(`db user-interface could not be found for database '${dbConnectionSelector}'`)
        return DatabaseUserInterfaceController.interfaces[dbConnectionSelector]
    }
}


export interface DatabaseUserPortalInterface {
    runRawQuery: Function,
    /**
     * SQL statement Operations by npm Sequelize. Example:
     * ```
     *  Database.table("users").where({
     *      lastName: "wonderful",
     *      age: Database.op.gt(21) 
     *  })
     * ```
     */
    op: any,

    /**
     * Return a nodepull table. Example:
     * ```
     * Database.table('users')
     * ```
     */
    table: Function,

    /**
     * SQL Query interface by npm Sequelize
     */
    getQueryInterface: Function
}
