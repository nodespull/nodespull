
import {DataTypes, Sequelize} from "sequelize";
import {Table, TableRelation, TableDefinition} from "./Table";
import DB_Controller from "./controller";
import error from "../etc/errors";
import { setTimeout } from "timers";
import sequelize from "sequelize";


export class DatabaseTools {
    private _isModeInstall:boolean;
    constructor(isModeInstall:boolean){
        this._isModeInstall = isModeInstall;
    }

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
    config:any = {};
    /**
     * Type of database data. Example:
     * ```
     *  Database.type.int
     * ```
     */
    type:Type= new Type();

    /**
     * SQL statement Operations. Example:
     * ```
     *  Database.table("users").where({
     *      lastName: "wonderful",
     *      age: Database.op.gt(21) 
     *  })
     * ```
     */
    op = sequelize.Op;


    /**
     * Add a SQL table relation. Example:
     * ```
     *  Database.linkTable("students").many_to_many("professors")
     * 
     * ```
     */
    linkTable(tableName:string):TableRelation{ this.op
        return new TableRelation(tableName,this._isModeInstall);
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
    defineTable(name:string):TableDefinition{
        return new TableDefinition(name) // store somewhere
    }

    /**
     * Return a nodepull table. Example:
     * ```
     * table('users')
     * ```
     */
    table(name:string):Table{
        if(!DB_Controller.ORM)error.db.modelNotSaved();
        return new Table(DB_Controller.ORM.interface.model(name));
    }
}


class Type{
    string = DataTypes.STRING;
    int = DataTypes.INTEGER;
    text = DataTypes.TEXT;
    float = DataTypes.FLOAT;
    time = DataTypes.TIME;
    date = DataTypes.DATE;
    dateOnly = DataTypes.DATEONLY;
    char = DataTypes.CHAR;
    bigInt = DataTypes.BIGINT;
    blob = DataTypes.BLOB;
    boolean = DataTypes.BOOLEAN;
    enum = DataTypes.ENUM;
}


export function DatabaseToolsFactory(isModeInstall:boolean):DatabaseTools {
    return new DatabaseTools(isModeInstall);
}

 
/**
 * Runs relations for auto-generated tables
 */
export class Relations{ // hard code reuse from DatabaseTools
    static connect(
        rootCopy1:string, one_to_one:string[], 
        rootCopy2:string, one_to_many:string[],
        rootCopy3:string, many_to_one:string[],
        rootCopy4:string, many_to_many:string[]
        ){
        for(let oTo of one_to_one) new TableRelation(rootCopy1,false).one_to_one(oTo);
        for(let oTm of one_to_many) new TableRelation(rootCopy1,false).one_to_many(oTm);
        for(let oTm of many_to_one) new TableRelation(oTm,false).one_to_many(rootCopy1);
        for(let mTm of many_to_many) new TableRelation(rootCopy1,false).many_to_many(mTm);
    }
}