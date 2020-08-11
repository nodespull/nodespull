import sequelize, { Sequelize } from "sequelize"
import { DataTypes } from "sequelize"
import { DatabaseConnectionController } from "../../connection"
import error, { Log } from "../../../etc/log"
import { QueryOption } from "../../models/option";



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
    select(callback:Function, options?:QueryOption){
        if(!this._utils.where) this._utils.where = {};
        this._model.findOne({
            where:this._utils.where, 
            include:[{all:true}],
            paranoid:options?(options.softDeleted?options.softDeleted==true:false):false
        }).then((res:any)=>{
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
    selectAll(callback:Function, options?:QueryOption){
        if(!this._utils.where) this._utils.where = {};
        this._model.findAll({
            where:this._utils.where, 
            include:[{all:true}], 
            paranoid:options?(options.softDeleted?options.softDeleted==true:false):false
        }).then((res:any)=>{
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
     * Mark one entry from the table as deleted. Example:
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
    /**
     * Mark one entry from the table as deleted. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).deleteSoft( (_, err) => {
     *      if(!err) console.log("user removed")
     *  })
     * ```
     */
    deleteSoft(callback:Function){
        this.delete(callback)
    }
    /**
     * Remove one entry from the table. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).deleteHard( (_, err) => {
     *      if(!err) console.log("user removed")
     *  })
     * ```
     */
    deleteHard(callback:Function){
        if(!this._utils.where) error.db.missingWhere_for(this._model.name+".deleteHard");
        this._model.destroy({where:this._utils.where, force:true}).then((res:any)=>{
            callback(res.dataValues, null);
        }).catch(e=>{
            callback(null, e);
        })
    }
    /**
     * Restore one deleted entry in the table. Example:
     * ```
     *  Database.table("users").where({
     *      email: "user@email.com"
     *  }).restore( (restoredUser, err) => {
     *      if(!err) console.log(restoredUser+" restored")
     *  })
     * ```
     */
    restore(callback:Function){
        if(!this._utils.where) error.db.missingWhere_for(this._model.name+".restore");
        this._model.restore({where:this._utils.where}).then((res:any)=>{
            callback(res.dataValues, null);
        }).catch(e=>{
            callback(null, e);
        })
    }
}



export class TableDefinition{
    _tableName:string;
    constructor(name:string, public connectionSelector:string){
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
        return DatabaseConnectionController.connections[this.connectionSelector].ORM.addTable(this._tableName,fields);
    }
}


export class ModelDefinition{
    constructor(public _tableName:string, public connectionSelector:string){}
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
        if(DatabaseConnectionController.connections[this.connectionSelector].migration.isRunning) {
            //DB_Controller.ORM.interface.models = {}
            DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.define(this._tableName, fields, {freezeTableName:true});
        }
        else{
            DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.define(this._tableName, fields, {freezeTableName:true});
        }
    }

}


export class TableRelation{
    private _model:sequelize.ModelCtor<sequelize.Model<any,any>>;
    constructor(tableName:string, public connectionSelector:string){
        this._model = DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(tableName);
    }

    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").one_to_one("tuition-accounts")
     * 
     * ```
     */
    one_to_one(arg:string|any):void{
        if(typeof arg == "string")this._model.hasOne(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg))
        else this._model.hasOne(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg.table),arg)
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").has_one("tuition-accounts")
     * 
     * ```
     */
    has_one(arg:string|any):void{
        if(typeof arg == "string")this._model.hasOne(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg))
        else this._model.hasOne(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg.table),arg)
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").belongsTo_one("tuition-accounts")
     * 
     * ```
     */
    belongsTo_one(arg:string|any):void{
        if(typeof arg == "string")this._model.belongsTo(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg))
        else this._model.belongsTo(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg.table),arg)
    }

    /**
     * One entry in the left table may be linked with many entries in the right table. Example:
     * ```
     *  Database.linkTable("students").one_to_many("id_cards")
     * 
     * ```
     */
    one_to_many(arg:string|any):void{
        if(typeof arg == "string")this._model.hasMany(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg))
        else this._model.hasMany(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg.table),arg)
    }

    /**
     * One entry in the left table may be linked with many entries in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").many_to_many("courses")
     * 
     * ```
     */
    many_to_many(arg:string|any):void{
        if(typeof arg == "string") this._model.belongsToMany(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg),{through:this._model.name+"_"+arg});
        else this._model.belongsToMany(DatabaseConnectionController.connections[this.connectionSelector].ORM.interface.model(arg.table),{through:this._model.name+"_"+arg.table,...arg});
    }
}
