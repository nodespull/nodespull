"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App_FilesLoader = void 0;
const db_model_rel_files_1 = require("./db-model-rel-files");
const module_files_1 = require("./module-files");
const service_files_1 = require("./service-files");
const route_files_1 = require("./route-files");
const database_files_1 = require("./database-files");
const auth_files_1 = require("./auth-files");
// load and complete runners in following order
class App_FilesLoader {
    constructor() {
        new database_files_1.Database_FilesLoader();
        new auth_files_1.Auth_FilesLoader();
        new db_model_rel_files_1.DB_Model_Rel_FilesLoader({ dbConnectionSelector: null });
        new module_files_1.Module_FilesLoader();
        new service_files_1.Service_FilesLoader();
        new route_files_1.RestRoute_FilesLoader();
    }
}
exports.App_FilesLoader = App_FilesLoader;
