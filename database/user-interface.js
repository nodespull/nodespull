"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserInterfaceController = void 0;
const connection_1 = require("./connection");
const user_interface_1 = require("./systems/mysql/user-interface");
const log_1 = require("../etc/log");
let DatabaseUserInterfaceController = /** @class */ (() => {
    class DatabaseUserInterfaceController {
        // add interface at the same time that a dbConnection is added
        static addUserInterfaceForDBConnection(connSelector) {
            if (!Object.keys(DatabaseUserInterfaceController.interfaces).includes(connSelector)) {
                let con = connection_1.DatabaseConnectionController.connections[connSelector];
                switch (con.conf.system) {
                    case ("mySQL"): {
                        DatabaseUserInterfaceController.interfaces[connSelector] = new user_interface_1.DatabaseUserPortal_mySQL(connSelector);
                        break;
                    }
                    default: new log_1.Log(`db-connection's user-interface could not be created; unsuported system '${con.conf.system}' for database '${con.conf.selector}'`).throwError();
                }
            }
        }
        static getUserInterfaceForDBConnection(dbConnectionSelector) {
            if (!Object.keys(DatabaseUserInterfaceController.interfaces).includes(dbConnectionSelector))
                new log_1.Log(`db user-interface could not be found for database '${dbConnectionSelector}'`);
            return DatabaseUserInterfaceController.interfaces[dbConnectionSelector];
        }
    }
    DatabaseUserInterfaceController.interfaces = {};
    return DatabaseUserInterfaceController;
})();
exports.DatabaseUserInterfaceController = DatabaseUserInterfaceController;
