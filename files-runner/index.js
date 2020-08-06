"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_sql_files_1 = require("./db-sql-files");
const module_files_1 = require("./module-files");
const service_files_1 = require("./service-files");
const route_files_1 = require("./route-files");
// load and complete runners in following order
new db_sql_files_1.DB_SQL_FilesRunner();
new module_files_1.Module_FilesRunner();
new service_files_1.Service_FilesRunner();
new route_files_1.Route_FilesRunner();
