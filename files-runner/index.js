"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_model_rel_files_1 = require("./db-model-rel-files");
const module_files_1 = require("./module-files");
const service_files_1 = require("./service-files");
const route_files_1 = require("./route-files");
const env_files_1 = require("./env-files");
const database_files_1 = require("./database-files");
// load and complete runners in following order
new env_files_1.Env_FilesRunner();
new database_files_1.Database_FilesRunner();
new db_model_rel_files_1.DB_Model_Rel_FilesRunner();
new module_files_1.Module_FilesRunner();
new service_files_1.Service_FilesRunner();
new route_files_1.RestRoute_FilesRunner();
