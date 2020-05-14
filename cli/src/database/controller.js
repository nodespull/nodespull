"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("sequelize"));
const Table_1 = require("./Table");
const functions_placeholders_1 = __importDefault(require("./etc/functions-placeholders"));
const DEFAULTS = {
    MYSQL_ROOT_USERNAME: "root",
    MYSQL_ROOT_PASSWORD: "nodespull-db-password",
    MYSQL_DATABASE: "nodespull-db-database",
    MYSQL_HOST: "localhost",
    PORT: "3333"
};
class DB_Controller {
    static setup(isModeInstall, dbTools) {
        DB_Controller.ORM = !isModeInstall ? new ORM(false, dbTools ? dbTools.config : undefined) : new ORM(true, {});
    }
    static connect() {
        this.ORM.interface.sync({ alter: true }).then(() => {
            console.log("Database Connection Established");
        });
    }
}
exports.default = DB_Controller;
DB_Controller.final_HostAddr = "";
class ORM {
    constructor(isModeInstall, sequelize_user_inputs) {
        if (isModeInstall)
            this.interface = Object.assign({}, functions_placeholders_1.default);
        else
            this.interface = this.setup(sequelize_user_inputs ? sequelize_user_inputs : {});
    }
    r() { } //rogue empty function for install mode
    // initialize sequelize instance for ORM
    setup(config) {
        DB_Controller.final_HostAddr = (config.host ? config.host : DEFAULTS.MYSQL_HOST) + (config.port ? config.port : DEFAULTS.PORT);
        return new sequelize_1.default.Sequelize(config.database ? config.database : DEFAULTS.MYSQL_DATABASE, config.username ? config.username : DEFAULTS.MYSQL_ROOT_USERNAME, config.password ? config.password : DEFAULTS.MYSQL_ROOT_PASSWORD, {
            port: config.port ? config.port : DEFAULTS.PORT,
            host: config.host ? config.host : DEFAULTS.MYSQL_HOST,
            dialect: config.dialect ? config.dialect : "mysql",
            pool: config.pool ? config.pool : {
                max: 10,
                min: 0,
                idle: 5000,
                acquire: 60000,
                evict: 1000,
            },
            dialectOptions: config.dialectOptions ? config.dialectOptions : { connectTimeout: 60000 },
            logging: false,
            define: config.define ? config.define : {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                paranoid: config.paranoid ? config.paranoid : false // for now, we delete permanently - until we review db dependencies
            }
        });
    }
    addTable(tableName, def) {
        this.interface.define(tableName, def, { freezeTableName: true });
        let model = DB_Controller.ORM.interface.model(tableName);
        return new Table_1.Table(model);
    }
}
