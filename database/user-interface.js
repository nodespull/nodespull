"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserInterfaceController = void 0;
const controller_1 = __importDefault(require("./controller"));
const user_interface_1 = require("./systems/mysql/user-interface");
const log_1 = require("../etc/log");
class DatabaseUserInterfaceController {
    constructor() {
        this.interfaces = {};
    }
    database(connSelector) {
        if (!Object.keys(this.interfaces).includes(connSelector)) {
            let con = controller_1.default.connections[connSelector];
            switch (con.conf.system) {
                case ("mySQL"): this.interfaces[connSelector] = new user_interface_1.DatabaseUserInterface_mySQL(connSelector);
                default: new log_1.Log(`unsuported system '${con.conf.system}' for database '${con.conf.selector}'`).throwError();
            }
        }
        return this.interfaces[connSelector];
    }
}
exports.DatabaseUserInterfaceController = DatabaseUserInterfaceController;
