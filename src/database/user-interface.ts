
import { DataTypes } from "sequelize";
import { TableRelation } from "./systems/mysql/Table";
import DB_Controller from "./controller";
import { DatabaseUserInterface_mySQL } from "./systems/mysql/user-interface";
import { Log } from "../etc/log";


export class DatabaseUserInterfaceController {

    interfaces:{[connSelector:string]:DatabaseUserInterface_interface} = {}

    constructor(){}
    database(connSelector:string){
        if(!Object.keys(this.interfaces).includes(connSelector)) {
            let con = DB_Controller.connections[connSelector]
            switch(con.conf.system){
                case("mySQL"): this.interfaces[connSelector] = new DatabaseUserInterface_mySQL(connSelector)
                default: new Log(`unsuported system '${con.conf.system}' for database '${con.conf.selector}'`).throwError()
            }
        }
        return this.interfaces[connSelector]
    }
}


export interface DatabaseUserInterface_interface {
    runRawQuery: Function
}
