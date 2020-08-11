"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_MySQL_Connection = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const Table_1 = require("./Table");
class DB_MySQL_Connection {
    constructor(conf) {
        this.conf = conf;
        this.final_HostAddr = "";
        this.migration = {
            isRunning: false,
            isRevertMode: false,
            rawQueries: new Array() // runs after model and relations are updated
        };
        this.ORM = new mySQL_ORM(conf);
    }
    start() {
        this.ORM.interface.sync({ alter: true }).then(() => {
            if (this.migration.isRunning)
                console.log(`migration complete for database '${this.conf.selector}'`);
            else
                console.log(`connection established with database '${this.conf.selector}'`);
        });
    }
}
exports.DB_MySQL_Connection = DB_MySQL_Connection;
class mySQL_ORM {
    // private r(){}//rogue empty function for install mode
    constructor(sequelize_user_inputs) {
        // if(isModeInstall) this.interface = {...functions_placeholders}
        this.interface = this.setup(sequelize_user_inputs);
    }
    // initialize sequelize instance for ORM
    setup(config) {
        // DB_Controller.final_HostAddr = (config.host?config.host:DEFAULTS.MYSQL_HOST) + (config.port?config.port:DEFAULTS.PORT);
        return new sequelize_1.default.Sequelize(config.database, config.username, config.password, {
            port: config.port,
            host: config.host,
            dialect: "mysql",
            pool: {
                max: 10,
                min: 0,
                idle: 5000,
                acquire: 60000,
                evict: 1000,
            },
            dialectOptions: { connectTimeout: 60000 },
            logging: false,
            define: {
                charset: 'utf8',
                collate: 'utf8_general_ci',
                paranoid: true
            }
        });
    }
    addTable(tableName, def) {
        this.interface.define(tableName, def, { freezeTableName: true });
        let model = this.interface.model(tableName);
        return new Table_1.Table(model);
    }
}
