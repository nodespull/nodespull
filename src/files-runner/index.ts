import { DB_Model_Rel_FilesRunner } from "./db-model-rel-files"
import { Module_FilesRunner } from "./module-files"
import { Service_FilesRunner } from "./service-files"
import { RestRoute_FilesRunner } from "./route-files"
import { Env_FilesRunner } from "./env-files"
import { Database_FilesRunner } from "./database-files"
import { Database } from "../server"
import DB_Controller from "../database/controller"


// load and complete runners in following order
new Env_FilesRunner()
new Database_FilesRunner()
new DB_Model_Rel_FilesRunner()
new Module_FilesRunner()
new Service_FilesRunner()
new RestRoute_FilesRunner()