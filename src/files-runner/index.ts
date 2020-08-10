import { DB_Model_Rel_FilesLoader } from "./db-model-rel-files"
import { Module_FilesLoader } from "./module-files"
import { Service_FilesLoader } from "./service-files"
import { RestRoute_FilesLoader } from "./route-files"
import { Env_FilesLoader } from "./env-files"
import { Database_FilesLoader } from "./database-files"


// load and complete runners in following order
export class App_FilesLoader{
    constructor(){
        new Database_FilesLoader()
        new DB_Model_Rel_FilesLoader()
        new Module_FilesLoader()
        new Service_FilesLoader()
        new RestRoute_FilesLoader()
    }
}
