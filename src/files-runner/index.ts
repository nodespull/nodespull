import { DB_SQL_FilesRunner } from "./db-sql-files"
import { Module_FilesRunner } from "./module-files"
import { Service_FilesRunner } from "./service-files"
import { Route_FilesRunner } from "./route-files"


// load and complete runners in following order
new DB_SQL_FilesRunner()
new Module_FilesRunner()
new Service_FilesRunner()
new Route_FilesRunner()