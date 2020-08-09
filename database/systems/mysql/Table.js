"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableRelation = exports.ModelDefinition = exports.TableDefinition = exports.Table = void 0;
const controller_1 = __importDefault(require("../../controller"));
const log_1 = __importDefault(require("../../../etc/log"));
class Table {
    constructor(model) {
        this._utils = {
            where: {},
        };
        this._model = model;
    }
    /**
     * Get name of SQL table
     */
    getName() { return this._model.name; }
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
    where(rows) {
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
    select(callback, options) {
        if (!this._utils.where)
            this._utils.where = {};
        this._model.findOne({
            where: this._utils.where,
            include: [{ all: true }],
            paranoid: options ? (options.softDeleted ? options.softDeleted == true : false) : false
        }).then((res) => {
            callback(res.dataValues, null);
        }).catch(e => {
            callback(null, e);
        });
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
    selectAll(callback, options) {
        if (!this._utils.where)
            this._utils.where = {};
        this._model.findAll({
            where: this._utils.where,
            include: [{ all: true }],
            paranoid: options ? (options.softDeleted ? options.softDeleted == true : false) : false
        }).then((res) => {
            callback(res.map((v) => v.dataValues), null);
        }).catch(e => {
            callback(null, e);
        });
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
    edit(row, callback) {
        if (row.uuid)
            delete row.uuid;
        if (!this._utils.where)
            log_1.default.db.missingWhere_for(this._model.name + ".edit");
        this._model.update(row, { where: this._utils.where }).then((res) => {
            callback(res.dataValues, null);
        }).catch(e => {
            callback(null, e);
        });
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
    insert(row, callback) {
        if (row.uuid)
            delete row.uuid;
        this._model.create(row, { include: [{ all: true }] }).then((res) => {
            callback(res.dataValues, null);
        }).catch(e => {
            callback(null, e);
        });
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
    delete(callback) {
        if (!this._utils.where)
            log_1.default.db.missingWhere_for(this._model.name + ".delete");
        this._model.destroy({ where: this._utils.where }).then((res) => {
            callback(res.dataValues, null);
        }).catch(e => {
            callback(null, e);
        });
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
    deleteSoft(callback) {
        this.delete(callback);
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
    deleteHard(callback) {
        if (!this._utils.where)
            log_1.default.db.missingWhere_for(this._model.name + ".deleteHard");
        this._model.destroy({ where: this._utils.where, force: true }).then((res) => {
            callback(res.dataValues, null);
        }).catch(e => {
            callback(null, e);
        });
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
    restore(callback) {
        if (!this._utils.where)
            log_1.default.db.missingWhere_for(this._model.name + ".restore");
        this._model.restore({ where: this._utils.where }).then((res) => {
            callback(res.dataValues, null);
        }).catch(e => {
            callback(null, e);
        });
    }
}
exports.Table = Table;
class TableDefinition {
    constructor(name, connectionSelector) {
        this.connectionSelector = connectionSelector;
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
    as(fields) {
        return controller_1.default.connections[this.connectionSelector].ORM.addTable(this._tableName, fields);
    }
}
exports.TableDefinition = TableDefinition;
class ModelDefinition {
    constructor(_tableName, connectionSelector) {
        this._tableName = _tableName;
        this.connectionSelector = connectionSelector;
    }
    /**
     * Define fields of the SQL table. Example:
     * ```
     * Database.defineModel('users').as({
     *      email: Database.type.string,
     *      phone: Database.type.int
     * })
     * ```
     */
    as(fields) {
        if (controller_1.default.connections[this.connectionSelector].migration.isRunning) {
            //DB_Controller.ORM.interface.models = {}
            controller_1.default.connections[this.connectionSelector].ORM.interface.define(this._tableName, fields, { freezeTableName: true });
        }
        else {
            controller_1.default.connections[this.connectionSelector].ORM.interface.define(this._tableName, fields, { freezeTableName: true });
        }
    }
}
exports.ModelDefinition = ModelDefinition;
class TableRelation {
    constructor(tableName, connectionSelector) {
        this.connectionSelector = connectionSelector;
        this._model = controller_1.default.connections[this.connectionSelector].ORM.interface.model(tableName);
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").one_to_one("tuition-accounts")
     *
     * ```
     */
    one_to_one(arg) {
        if (typeof arg == "string")
            this._model.hasOne(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg));
        else
            this._model.hasOne(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg.table), arg);
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").has_one("tuition-accounts")
     *
     * ```
     */
    has_one(arg) {
        if (typeof arg == "string")
            this._model.hasOne(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg));
        else
            this._model.hasOne(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg.table), arg);
    }
    /**
     * One entry in the left table may be linked with only one entry in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").belongsTo_one("tuition-accounts")
     *
     * ```
     */
    belongsTo_one(arg) {
        if (typeof arg == "string")
            this._model.belongsTo(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg));
        else
            this._model.belongsTo(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg.table), arg);
    }
    /**
     * One entry in the left table may be linked with many entries in the right table. Example:
     * ```
     *  Database.linkTable("students").one_to_many("id_cards")
     *
     * ```
     */
    one_to_many(arg) {
        if (typeof arg == "string")
            this._model.hasMany(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg));
        else
            this._model.hasMany(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg.table), arg);
    }
    /**
     * One entry in the left table may be linked with many entries in the right table and vice versa. Example:
     * ```
     *  Database.linkTable("students").many_to_many("courses")
     *
     * ```
     */
    many_to_many(arg) {
        if (typeof arg == "string")
            this._model.belongsToMany(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg), { through: this._model.name + "_" + arg });
        else
            this._model.belongsToMany(controller_1.default.connections[this.connectionSelector].ORM.interface.model(arg.table), Object.assign({ through: this._model.name + "_" + arg.table }, arg));
    }
}
exports.TableRelation = TableRelation;
