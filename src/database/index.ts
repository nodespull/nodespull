import {DatabaseConnectionController} from "./connection";
import { DatabaseUserInterfaceController, DatabaseUserPortalInterface } from "./user-interface";
import { Log } from "../etc/log";
import { DatabaseUserPortal_mySQL } from "./systems/mysql/user-interface";

/**
 * Database main handler (function) exposed to the user
 */
module.exports = function userExportedPortal(dbConnectionSelector:string): userExportedPortalResult_interface {
    let userInterface =  DatabaseUserInterfaceController.getUserInterfaceForDBConnection(dbConnectionSelector)
    let system = DatabaseConnectionController.getConnection(dbConnectionSelector).conf.system
    switch(system){
        case("mySQL"): {
            return { editor: userInterface as DatabaseUserPortal_mySQL }
        }
        default: {
            new Log(`error when loading database interface controller for user: system '${system}' not recognized`).throwError()
            process.exit()
        }
    }
}

interface userExportedPortalResult_interface{
    editor: DatabaseUserPortalInterface
}