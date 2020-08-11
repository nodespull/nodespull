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
exports.Relations = exports.DatabaseToolsFactory = exports.DatabaseTools = void 0;
const sequelize_1 = require("sequelize");
const Table_1 = require("./Table");
const controller_1 = __importDefault(require("./controller"));
const log_1 = __importDefault(require("../etc/log"));
const sequelize_2 = __importDefault(require("sequelize"));
class DatabaseTools {
    constructor(isModeInstall) {
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
        this._isModeInstall = isModeInstall;
    }
    defineModel(tableName) {
        return new Table_1.ModelDefinition(tableName); // store somewhere
    }
    /**
     * Add a SQL table relation. Example:
     * ```
     *  Database.linkTable("students").many_to_many("professors")
     *
     * ```
     */
    linkTable(tableName) {
        this.op;
        return new Table_1.TableRelation(tableName, this._isModeInstall);
    }
    /**
     * Define a SQL table. Example:
     * ```
     * Database.defineTable('users').as({
     *      email: Database.type.string,
     *      phone: Database.type.int
     * })
     * ```
     */
    defineTable(name) {
        return new Table_1.TableDefinition(name); // store somewhere
    }
    /**
     * Return a nodepull table. Example:
     * ```
     * Database.table('users')
     * ```
     */
    table(name) {
        if (!controller_1.default.ORM)
            log_1.default.db.modelNotSaved();
        return new Table_1.Table(controller_1.default.ORM.interface.model(name));
    }
    /**
     * Upload database version
     * @param {Function} actions
     */
    onUpload(actions) {
        if (!controller_1.default.migration.isRunning || controller_1.default.migration.isRevertMode)
            return;
        actions();
    }
    /**
     * Revert database to previous version
     * @param {Function} actions
     */
    onRevert(actions) {
        if (!controller_1.default.migration.isRunning || !controller_1.default.migration.isRevertMode)
            return;
        actions();
    }
    runRawQuery(query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!query)
                return Promise.resolve(null);
            let [results, metadata] = yield controller_1.default.ORM.interface.query(query);
            return Promise.resolve({ results, metadata });
        });
    }
    // only loads it into the migration obj -- will be ran migration.ts
    rawQuery(query) {
        controller_1.default.migration.rawQueries.push(query);
    }
    getQueryInterface() {
        return controller_1.default.ORM.interface.getQueryInterface();
    }
}
exports.DatabaseTools = DatabaseTools;
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
    }
}
function DatabaseToolsFactory(isModeInstall) {
    return new DatabaseTools(isModeInstall);
}
exports.DatabaseToolsFactory = DatabaseToolsFactory;
/**
 * Runs relations for auto-generated tables
 */
class Relations {
    static connect(rootCopy1, one_to_one, rootCopy2, one_to_many, rootCopy3, many_to_one, rootCopy4, many_to_many) {
        for (let oTo of one_to_one)
            new Table_1.TableRelation(rootCopy1, false).one_to_one(oTo);
        for (let oTm of one_to_many)
            new Table_1.TableRelation(rootCopy1, false).one_to_many(oTm);
        if (many_to_one)
            for (let oTm of many_to_one)
                new Table_1.TableRelation(oTm, false).one_to_many(rootCopy1);
        for (let mTm of many_to_many)
            new Table_1.TableRelation(rootCopy1, false).many_to_many(mTm);
    }
    static set(rootTable, args) {
        if (args.one_to_one) {
            for (let target of args.one_to_one.has)
                new Table_1.TableRelation(rootTable, false).has_one(target);
            for (let target of args.one_to_one.belongsTo)
                new Table_1.TableRelation(rootTable, false).belongsTo_one(target);
        }
        if (args.has_one)
            for (let target of args.has_one)
                new Table_1.TableRelation(rootTable, false).has_one(target);
        if (args.one_to_many)
            for (let target of args.one_to_many)
                new Table_1.TableRelation(rootTable, false).one_to_many(target);
        if (args.has_many)
            for (let target of args.has_many)
                new Table_1.TableRelation(rootTable, false).one_to_many(target);
        if (args.many_to_one)
            for (let target of args.many_to_one)
                new Table_1.TableRelation(target, false).many_to_many(rootTable);
        for (let target of args.many_to_many)
            new Table_1.TableRelation(rootTable, false).many_to_many(target);
    }
}
exports.Relations = Relations;
