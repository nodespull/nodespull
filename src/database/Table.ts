import sequelize, { Sequelize } from "sequelize"
import {DataTypes} from "sequelize"
import DB_Controller from "./controller"
import error from "../etc/errors"



export class Table{
    private _model:sequelize.ModelCtor<sequelize.Model<any,any>>;
    private _utils = {
        where:{},
    }
    constructor(model:sequelize.ModelCtor<sequelize.Model<any,any>>){
        this._model = model;
    }
    /**
     * Get name of SQL table
     */
    getName():string{ return this._model.name;}

    /**
     * Filter row from table before an action. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com",
     *      firstName: Database.op.like("doe"),
     *      age: Database.op.gt(5)
     *  })
     * ```
     */
    where(rows:any):Table{
        let next = new Table(this._model);
        next._utils.where = rows;
        return next;
    }
    /**
     * Get first entry that matches specifications within the table. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).select( (user,err) => {
     *      console.log(user)
     *  })
     * ```
     */
    select(callback:Function){
        if(!this._utils.where) this._utils.where = {};
        this._model.findOne({where:this._utils.where, include:[{all:true}]}).then((res:any)=>{
            callback(res.dataValues, null);
        }).catch(e=>{
            callback(null, e)
        })
    }
    /**
     * Get all entries that match specifications within the table. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).selectAll( (users,err) => {
     *      console.log(users)
     *  })
     * ```
     */
    selectAll(callback:Function){
        if(!this._utils.where) this._utils.where = {};
        this._model.findAll({where:this._utils.where, include:[{all:true}]}).then((res:any)=>{
            callback(res.map((v:any)=>v.dataValues), null);
        }).catch(e=>{
            callback(null, e);
        })
    }
    /**
     * Edit one entry that matches specifications within the table. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).edit( (editedUser,err) => {
     *      console.log(editedUser.email)
     *  })
     * ```
     */
    edit(row:any, callback:Function){
        if(row.uuid) delete row.uuid
        if(!this._utils.where) error.db.missingWhere_for(this._model.name+".edit");
        this._model.update(row,{where:this._utils.where}).then((res:any)=>{
            callback(res.dataValues, null);
        }).catch(e=>{
            callback(null, e);
        })
    }
    /**
     * Insert one entry to the table. Example:
     * ```
     *  Database.table("users").insert({
     *      email: "user@email.com"
     *  }, (newUser,err) => {
     *      console.log(newUser.email)
     *  })
     * ```
     */
    insert(row:any, callback:Function){
        if(row.uuid) delete row.uuid
        this._model.create(row, {include:[{all:true}]}).then((res:any)=>{
            callback(res.dataValues, null);
        }).catch(e=>{
            callback(null, e);
        })
    }
    /**
     * Delete one entry from the table as specified. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).delete( (_, err) => {
     *      if(!err) console.log("user removed")
     *  })
     * ```
     */
    delete(callback:Function){
        if(!this._utils.where) error.db.missingWhere_for(this._model.name+".delete");
        this._model.destroy({where:this._utils.where}).then((res:any)=>{
            callback(res.dataValues, null);
        }).catch(e=>{
            callback(null, e);
        })
    }
}



export class TableDefinition{
    _tableName:string;
    constructor(name:string){
        this._tableName = name;
    }
    /**
     * Define fields of the new SQL table. Example:
     * ```
     * Database.defineTable('users').as({
     *      email: Database.type.string,
     *      phone: Database.type.int
     * })
     * ```
     */
    as(fields:any):Table{
        return DB_Controller.ORM.addTable(this._tableName,fields);
    }
}


export class ModelDefinition{
    constructor(public _tableName:string){}
    /**
     * Define fields of the SQL table. Example:
     * ```
     * Database.defineModel('users').as({
     *      email: Database.type.string,
     *      phone: Database.type.int
     * })
     * ```
     */
    as(fields:any):void{
        if(DB_Controller.isRunningMigration) {
            DB_Controller.ORM.interface.models = {}
            DB_Controller.ORM.interface.define(this._tableName,fields, {freezeTableName:true});
            DB_Controller.ORM.interface.sync({alter:true}).error((err:any)=>{
                console.error("\x1b[31m",`error: failed to update table '${this._tableName}'`, "\x1b[37m")
            })
        }
        else{
            DB_Controller.ORM.interface.define(this._tableName,fields, {freezeTableName:true});
        }
    }

}


export class TableRelation{
    private _model:sequelize.ModelCtor<sequelize.Model<any,any>>;
    private _isModeInstall:boolean;
    constructor(tableName:string, isModeInstall:boolean){
        this._isModeInstall = isModeInstall;
        this._model = DB_Controller.ORM.interface.model(tableName);
    }

    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").one_to_one("tuition-accounts")
     * 
     * ```
     */
    one_to_one(arg:string|any):void{
        if(this._isModeInstall) return;
        if(typeof arg == "string")this._model.hasOne(DB_Controller.ORM.interface.model(arg))
        else this._model.hasOne(DB_Controller.ORM.interface.model(arg.table),arg)
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").has_one("tuition-accounts")
     * 
     * ```
     */
    has_one(arg:string|any):void{
        if(this._isModeInstall) return;
        if(typeof arg == "string")this._model.hasOne(DB_Controller.ORM.interface.model(arg))
        else this._model.hasOne(DB_Controller.ORM.interface.model(arg.table),arg)
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").belongsTo_one("tuition-accounts")
     * 
     * ```
     */
    belongsTo_one(arg:string|any):void{
        if(this._isModeInstall) return;
        if(typeof arg == "string")this._model.belongsTo(DB_Controller.ORM.interface.model(arg))
        else this._model.belongsTo(DB_Controller.ORM.interface.model(arg.table),arg)
    }

    /**
     * One entry in the left table may be linked with many entries in the right table. Example:
     * ```
     *  Database.linkTable("students").one_to_many("id_cards")
     * 
     * ```
     */
    one_to_many(arg:string|any):void{
        if(this._isModeInstall) return;
        if(typeof arg == "string")this._model.hasMany(DB_Controller.ORM.interface.model(arg))
        else this._model.hasMany(DB_Controller.ORM.interface.model(arg.table),arg)
    }

    /**
     * One entry in the left table may be linked with many entries in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").many_to_many("courses")
     * 
     * ```
     */
    many_to_many(arg:string|any):void{
        if(this._isModeInstall) return;
        if(typeof arg == "string") this._model.belongsToMany(DB_Controller.ORM.interface.model(arg),{through:this._model.name+"_"+arg});
        else this._model.belongsToMany(DB_Controller.ORM.interface.model(arg.table),{through:this._model.name+"_"+arg.table,...arg});
    }
}
