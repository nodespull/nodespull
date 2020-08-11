import { db_mySQLConnectionArg } from "../systems/mysql/model";

export interface DB_Connection {
    conf: db_mySQLConnectionArg
    start: Function
}