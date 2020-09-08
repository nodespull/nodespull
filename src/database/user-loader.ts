import { DbConnectionArg } from "./models/connectionArg";
import { DatabaseConnectionController } from "./connection";


export class npDatabaseConnectionLoader{
    static register(args:DbConnectionArg){
        if(args.system == "mySQL") DatabaseConnectionController.createMySQLConnection(args)
    }
}