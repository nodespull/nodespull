"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_files_1 = require("./db-files");
const module_files_1 = require("./module-files");
const function_files_1 = require("./function-files");
const route_files_1 = require("./route-files");
// load and complete runners in following order
new db_files_1.DB_FilesRunner();
new module_files_1.Module_FilesRunner();
new function_files_1.Function_FilesRunner();
new route_files_1.Route_FilesRunner();
