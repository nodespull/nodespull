import { DB_Model_Rel_FilesLoader } from "./db-model-rel-files"
import { Module_FilesLoader } from "./module-files"
import { Service_FilesLoader } from "./service-files"
import { RestRoute_FilesLoader } from "./route-files"
import { Env_FilesLoader } from "./env-files"
import { Database_FilesLoader } from "./database-files"
import { Auth_FilesLoader } from "./auth-files"


// load and complete runners in following order
export class FilesLoader{

    static All(){
        Env_FilesLoader.load()
        Database_FilesLoader.load()
        Auth_FilesLoader.load()
        DB_Model_Rel_FilesLoader.load()
        Module_FilesLoader.load()
        Service_FilesLoader.load()
        RestRoute_FilesLoader.load()
    }

    static Env(){Env_FilesLoader.load()}
    static Database(){Database_FilesLoader.load()}
    static Auth(){Auth_FilesLoader.load()}
    static DB_AttrRel(){DB_Model_Rel_FilesLoader.load()}
    static Module(){Module_FilesLoader.load()}
    static Service(){Service_FilesLoader.load()}
    static RestRoute(){RestRoute_FilesLoader.load()}

}
