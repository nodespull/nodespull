"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = require("./connection");
const user_interface_1 = require("./user-interface");
const log_1 = require("../etc/log");
/**
 * Database main handler (function) exposed to the user
 */
module.exports = function userExportedPortal(dbConnectionSelector) {
    let userInterface = user_interface_1.DatabaseUserInterfaceController.getUserInterfaceForDBConnection(dbConnectionSelector);
    let system = connection_1.DatabaseConnectionController.getConnection(dbConnectionSelector).conf.system;
    switch (system) {
        case ("mySQL"): {
            return { Database: userInterface };
        }
        default: {
            new log_1.Log(`error when loading database interface controller for user: system '${system}' not recognized`).throwError();
            process.exit();
        }
    }
};
