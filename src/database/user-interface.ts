
import { DataTypes } from "sequelize";
import { TableRelation } from "./systems/mysql/Table";
import {DatabaseConnectionController} from "./connection";
import { DatabaseUserInterface_mySQL } from "./systems/mysql/user-interface";
import { Log } from "../etc/log";


export class DatabaseUserInterfaceController {

    static interfaces:{[connSelector:string]:DatabaseUserInterface_interface} = {}

    constructor(){}
    // add interface at the same time that a dbConnection is added
    static addUserInterfaceForDBConnection(connSelector:string){
        if(!Object.keys(DatabaseUserInterfaceController.interfaces).includes(connSelector)) {
            let con = DatabaseConnectionController.connections[connSelector]
            switch(con.conf.system){
                case("mySQL"): {
                    DatabaseUserInterfaceController.interfaces[connSelector] = new DatabaseUserInterface_mySQL(connSelector)
                    break
                }
                default: new Log(`db-connection's user-interface could not be created; unsuported system '${con.conf.system}' for database '${con.conf.selector}'`).throwError()
            }
        }
        return DatabaseUserInterfaceController.interfaces[connSelector]
    }
    static getUserInterfaceForDBConnection(dbConnectionSelector:string){
        if(!Object.keys(DatabaseUserInterfaceController.interfaces).includes(dbConnectionSelector)) new Log(`db user-interface could not be found for database '${dbConnectionSelector}'`)
        return DatabaseUserInterfaceController.interfaces[dbConnectionSelector]
    }
}


export interface DatabaseUserInterface_interface {
    runRawQuery: Function
}
