"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = void 0;
const { DataTypes } = require("sequelize");
/**
 * SQL Database types
 */
class Type {
    constructor() {
        this.string = DataTypes.STRING;
        this.int = DataTypes.INTEGER;
        this.text = DataTypes.TEXT;
        this.float = DataTypes.FLOAT;
        this.time = DataTypes.TIME;
        this.date = DataTypes.DATE;
        this.dateOnly = DataTypes.DATEONLY;
        this.char = DataTypes.CHAR;
        this.bigInt = DataTypes.BIGINT;
        this.blob = DataTypes.BLOB;
        this.boolean = DataTypes.BOOLEAN;
        this.enum = DataTypes.ENUM;
        this.uuid = DataTypes.UUID;
        this.UUIDV1 = DataTypes.UUIDV1;
        this.UUIDV4 = DataTypes.UUIDV4;
        this.NOW = DataTypes.NOW;
        this.array = DataTypes.ARRAY;
    }
}
exports.type = new Type();
