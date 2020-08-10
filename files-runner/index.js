"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App_FilesLoader = void 0;
const db_model_rel_files_1 = require("./db-model-rel-files");
const module_files_1 = require("./module-files");
const service_files_1 = require("./service-files");
const route_files_1 = require("./route-files");
const env_files_1 = require("./env-files");
const database_files_1 = require("./database-files");
// load and complete runners in following order
class App_FilesLoader {
    constructor() {
        new env_files_1.Env_FilesLoader();
        new database_files_1.Database_FilesLoader();
        new db_model_rel_files_1.DB_Model_Rel_FilesLoader();
        new module_files_1.Module_FilesLoader();
        new service_files_1.Service_FilesLoader();
        new route_files_1.RestRoute_FilesLoader();
    }
}
exports.App_FilesLoader = App_FilesLoader;
