 
 const {DataTypes} = require("sequelize");
 
 /**
  * SQL Database types
  */

 class Type{
    constructor(){}
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
    uuid = DataTypes.UUID;
    UUIDV1 = DataTypes.UUIDV1;
    UUIDV4 = DataTypes.UUIDV4;
    NOW = DataTypes.NOW;
    array = DataTypes.ARRAY;
}

export const type = new Type();
