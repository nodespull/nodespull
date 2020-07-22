import { DB_FilesRunner } from "./db-files"
import { Module_FilesRunner } from "./module-files"
import { Function_FilesRunner } from "./function-files"
import { Route_FilesRunner } from "./route-files"


// load and complete runners in following order
new DB_FilesRunner()
new Module_FilesRunner()
new Function_FilesRunner()
new Route_FilesRunner()