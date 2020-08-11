"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseUserPortal_mySQL = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("sequelize"));
const Table_1 = require("./Table");
const connection_1 = require("../../connection");
class DatabaseUserPortal_mySQL {
    constructor(connectionSelector) {
        this.connectionSelector = connectionSelector;
        this.defineModel = (tableName) => {
            return new Table_1.ModelDefinition(tableName, this.connectionSelector); // store somewhere
        };
        /**
         * Database configuration object as specified by (npm) Sequelize.
         * ```
         * Database.config = {
         *      username: "myExistingDB_username",
         *      passsord: "myExistingDB_password",
         *      host: "myExistingDB_host",
         *      database: "myExistingDB_databaseName",
         *      port: 3306 // or any port from which database should be accessed
         * }
         * ```
         */
        this.config = {};
        /**
         * Type of database data. Example:
         * ```
         *  Database.type.int
         * ```
         */
        this.type = new Type();
        /**
         * SQL statement Operations. Example:
         * ```
         *  Database.table("users").where({
         *      lastName: "wonderful",
         *      age: Database.op.gt(21)
         *  })
         * ```
         */
        this.op = sequelize_2.default.Op;
        /**
         * Add a SQL table relation. Example:
         * ```
         *  Database.linkTable("students").many_to_many("professors")
         *
         * ```
         */
        this.linkTable = (tableName) => {
            return new Table_1.TableRelation(tableName, this.connectionSelector);
        };
        /**
         * Define a SQL table. Example:
         * ```
         * Database.defineTable('users').as({
         *      email: Database.type.string,
         *      phone: Database.type.int
         * })
         * ```
         */
        this.defineTable = (name) => {
            return new Table_1.TableDefinition(name, this.connectionSelector); // store somewhere
        };
        /**
         * Return a nodepull table. Example:
         * ```
         * Database.table('users')
         * ```
         */
        this.table = (name) => {
            // if(!DB_Controller.ORM)error.db.modelNotSaved();
            return new Table_1.Table(connection_1.DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(name));
        };
        /**
         * Upload database version
         * @param {Function} actions
         */
        this.onUpload = (actions) => {
            if (!connection_1.DatabaseConnectionController.connections[this.connectionSelector].migration.isRunning ||
                connection_1.DatabaseConnectionController.connections[this.connectionSelector].migration.isRevertMode)
                return;
            actions();
        };
        /**
         * Revert database to previous version
         * @param {Function} actions
         */
        this.onRevert = (actions) => {
            if (!connection_1.DatabaseConnectionController.connections[this.connectionSelector].migration.isRunning ||
                !connection_1.DatabaseConnectionController.connections[this.connectionSelector].migration.isRevertMode)
                return;
            actions();
        };
        this.runRawQuery = (query) => __awaiter(this, void 0, void 0, function* () {
            if (!query)
                return Promise.resolve(null);
            let [results, metadata] = yield connection_1.DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.query(query);
            return Promise.resolve({ results, metadata });
        });
        // only loads it into the migration obj -- will be ran migration.ts
        this.rawQuery = (query) => {
            connection_1.DatabaseConnectionController.connections[this.connectionSelector].migration.rawQueries.push(query);
        };
        this.getQueryInterface = () => {
            return connection_1.DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.getQueryInterface();
        };
        this.Relations = {
            set: (rootTable, args) => {
                if (args.one_to_one) {
                    for (let target of args.one_to_one.has)
                        new Table_1.TableRelation(rootTable, this.connectionSelector).has_one(target);
                    for (let target of args.one_to_one.belongsTo)
                        new Table_1.TableRelation(rootTable, this.connectionSelector).belongsTo_one(target);
                }
                if (args.has_one)
                    for (let target of args.has_one)
                        new Table_1.TableRelation(rootTable, this.connectionSelector).has_one(target);
                if (args.one_to_many)
                    for (let target of args.one_to_many)
                        new Table_1.TableRelation(rootTable, this.connectionSelector).one_to_many(target);
                if (args.has_many)
                    for (let target of args.has_many)
                        new Table_1.TableRelation(rootTable, this.connectionSelector).one_to_many(target);
                if (args.many_to_one)
                    for (let target of args.many_to_one)
                        new Table_1.TableRelation(target, this.connectionSelector).many_to_many(rootTable);
                for (let target of args.many_to_many)
                    new Table_1.TableRelation(rootTable, this.connectionSelector).many_to_many(target);
            }
        };
    }
}
exports.DatabaseUserPortal_mySQL = DatabaseUserPortal_mySQL;
class Type {
    constructor() {
        this.string = sequelize_1.DataTypes.STRING;
        this.int = sequelize_1.DataTypes.INTEGER;
        this.text = sequelize_1.DataTypes.TEXT;
        this.float = sequelize_1.DataTypes.FLOAT;
        this.time = sequelize_1.DataTypes.TIME;
        this.date = sequelize_1.DataTypes.DATE;
        this.dateOnly = sequelize_1.DataTypes.DATEONLY;
        this.char = sequelize_1.DataTypes.CHAR;
        this.bigInt = sequelize_1.DataTypes.BIGINT;
        this.blob = sequelize_1.DataTypes.BLOB;
        this.boolean = sequelize_1.DataTypes.BOOLEAN;
        this.enum = sequelize_1.DataTypes.ENUM;
        this.uuid = sequelize_1.DataTypes.UUID;
        this.UUIDV1 = sequelize_1.DataTypes.UUIDV1;
        this.UUIDV4 = sequelize_1.DataTypes.UUIDV4;
        this.NOW = sequelize_1.DataTypes.NOW;
        this.array = sequelize_1.DataTypes.ARRAY;
    }
}
// export function DatabaseToolsFactory():DatabaseTools {
//     return new DatabaseTools();
// }
/**
 * Runs relations for auto-generated tables
 */
// export class Relations{ // hard code reuse from DatabaseTools
//     static connect(
//         rootCopy1:string, one_to_one:string[], 
//         rootCopy2:string, one_to_many:string[],
//         rootCopy3:string, many_to_one:string[],
//         rootCopy4:string, many_to_many:string[]
//         ){
//         for(let oTo of one_to_one) new TableRelation(rootCopy1).one_to_one(oTo);
//         for(let oTm of one_to_many) new TableRelation(rootCopy1).one_to_many(oTm);
//         if(many_to_one) for(let oTm of many_to_one) new TableRelation(oTm).one_to_many(rootCopy1);
//         for(let mTm of many_to_many) new TableRelation(rootCopy1).many_to_many(mTm);
//     }
//     static set(rootTable:string, args:any){
//         if(args.one_to_one){
//             for(let target of args.one_to_one.has) new TableRelation(rootTable).has_one(target);
//             for(let target of args.one_to_one.belongsTo) new TableRelation(rootTable).belongsTo_one(target);
//         }
//         if(args.has_one) for(let target of args.has_one) new TableRelation(rootTable).has_one(target);
//         if(args.one_to_many) for(let target of args.one_to_many) new TableRelation(rootTable).one_to_many(target);
//         if(args.has_many) for(let target of args.has_many) new TableRelation(rootTable).one_to_many(target);
//         if(args.many_to_one) for(let target of args.many_to_one) new TableRelation(target).many_to_many(rootTable);
//         for(let target of args.many_to_many) new TableRelation(rootTable).many_to_many(target);
//     }
// }
