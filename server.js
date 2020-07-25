"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.server = exports.http = exports.Router = exports.route = exports.appServer = exports.npService = exports.npRoute = exports.npModule = exports.Database = exports.db = exports.DB_PORT_TEST = exports.PORT = void 0;
const install_1 = require("./install");
const cli = __importStar(require("./cli/cli"));
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./database/controller"));
const tools_1 = require("./database/tools");
const controller_2 = require("./route/controller");
const jwt_1 = require("./route/auth/jwt");
const json_1 = require("./etc/system-tools/json");
const exe_log_1 = require("./cli/exe/exe.log");
const deploy_1 = require("./cli/deploy/deploy");
const npModuleController_1 = require("./module/v2-module/controllers/npModuleController");
const npRouteController_1 = require("./module/v2-module/controllers/npRouteController");
const migration_1 = require("./database/migration");
const packageJson = json_1.parseJSON("./package.json");
exports.PORT = 8888;
exports.DB_PORT_TEST = 3332;
const app = express_1.default();
let noDatabase = false;
function startServer(port, after) {
    // check that cors configurations are set
    if (!isCorsSet)
        new log_1.Log('CORS config not set. please add (and edit if needed) the codes below to your "' + packageJson.main + '" file before calling $.server.ready():\n\n\
    \t$.config.cors([  {domain: "*", methods: "POST, GET, DELETE, PUT, HEAD, OPTIONS"}  ])\n\n').throwWarn();
    port = parseInt(process.env.PORT, 10) || port;
    app.listen(port, () => {
        new log_1.Log("\n\nApp Server Started at http://localhost:" + port + "\n Open \"nodespull_README.md\" for details.").FgGreen().printValue();
        if (after)
            after(port);
    });
}
/* --------------- Developer Interface --------------- */
let rootFile_name = process.argv[1].split("/").pop();
let flag = process.argv[2];
let isModeInstall = (flag && flag == "init") ? true : false;
/**
 * Main database module that trades with MySQL server using (npm) Sequelize
 */
exports.db = new tools_1.DatabaseTools(isModeInstall); //allows for intellisense, updated in setup_db
exports.Database = exports.db;
function setup_db(dbConstroller) {
    exports.db = tools_1.DatabaseToolsFactory(isModeInstall);
    dbConstroller.setup(isModeInstall, exports.db);
}
let Server = /** @class */ (() => {
    class Server {
        constructor() {
            this._sys = {
                _beforeStart: new Function(),
                _afterStart: new Function(),
                _start(after) {
                    if (!noDatabase)
                        controller_1.default.connect();
                    startServer(exports.PORT, after);
                }
            };
        }
        /**
         * Serve the node.js app on specified port.
         * @param port
         */
        ready(args) {
            return __awaiter(this, void 0, void 0, function* () {
                if (Server.isRunning)
                    return;
                if (args && args.port)
                    exports.PORT = args.port;
                if (args && args.mode)
                    process.argv[2] = args.mode;
                if (args && args.database) {
                    exports.db.config.database = args.database;
                    if (args.database == "nodespull-test-database")
                        exports.db.config.port = exports.DB_PORT_TEST;
                }
                if (args && args.use_database === false)
                    noDatabase = true;
                if (!controller_2.Route._home_set)
                    app.use("/", express_1.default.static(__dirname + '/public'));
                let flag = process.argv[2];
                let prod = process.argv[3] && process.argv[3] == "-c";
                let run_setup = (flag && flag == "init") ? true : false;
                let run_dbImages_only = (flag && flag == "boot") ? true : false;
                let stop_dbImages_only = (flag && flag == "stop") ? true : false;
                let run_all_images = (flag && flag == "boot" && prod) ? true : false;
                let stop_all_images = (flag && flag == "stop" && prod) ? true : false;
                let buildFlag = (flag && flag == "build") ? true : false;
                let runFlag = (flag && flag == "run") ? true : false;
                let runFlag_fromContainer = (flag && flag == "docker-run") ? true : false;
                let status = (flag && flag == "status") ? true : false;
                let cliFlag = (flag && flag == "cli") ? true : false;
                let doFlag = (flag && flag == "do") ? true : false; // runs in nodespull cli
                let testFlag = (flag && flag == "test") ? true : false;
                let deployFlag = (flag && flag == "deploy") ? true : false;
                let migrateFlag = (flag && flag == "migrate") ? true : false;
                if (runFlag_fromContainer) {
                    exports.db.config.host = "nodespull-db-server";
                    exports.db.config.port = "3306";
                }
                controller_1.default.setup(isModeInstall, exports.db);
                if (run_setup) {
                    install_1.install(rootFile_name, exports.PORT, true, setup_db, tools_1.DatabaseTools, controller_1.default); // install sql db image, db adminer, and dockerfile, + criticals
                    packageJson["scripts"] = {
                        start: "node " + rootFile_name + " run",
                        test: "mocha " + install_1.appModule + "/**/*.spec.js || true"
                    };
                    packageJson["main"] = rootFile_name;
                    json_1.writeJSON("./package.json", packageJson);
                }
                else if (cliFlag) {
                    cli.start();
                }
                else if (doFlag) {
                    cli.getCmd(process.argv[3], false);
                }
                else if (testFlag) {
                    exe_log_1.cmd("npm", ["test"]);
                }
                else if (run_all_images) {
                    exe_log_1.cmd('docker', ["stop", "nodespull_" + rootFile_name + "_1"], false);
                    exe_log_1.cmd('docker', ["rm", "nodespull_" + rootFile_name + "_1"], false);
                    exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-all.yml", "up", "--build"], true);
                }
                else if (stop_all_images) {
                    exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-all.yml", "down"], true);
                }
                else if (buildFlag) {
                    exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-all.yml", "build"], false);
                }
                else if (run_dbImages_only) {
                    console.log("\n\n Wait until no new event, then open a new terminal to run your app.\n\n\n");
                    exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-db.yml", "up",], true);
                }
                else if (stop_dbImages_only) {
                    exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-db.yml", "down"], true);
                }
                else if (status) {
                    exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-all.yml", "ps"], true);
                }
                else if (runFlag || runFlag_fromContainer) {
                    Server.isRunning = true;
                    require("./files-runner"); // now that sequelize obj is initialized, load routes, tables, and relations
                    if (this._sys._beforeStart)
                        this._sys._beforeStart();
                    yield this._sys._start(this._sys._afterStart);
                }
                else if (deployFlag) {
                    deploy_1.deploy();
                }
                else if (migrateFlag) {
                    new migration_1.Migration(process.argv[3]);
                }
                else {
                    console.log("\nTag missing. See options below: \n\
            \n  init        initialize nodespull app\
            \n  cli         open nodespull cli\
            \n  boot        start nodespull servers: database, db_portal\
            \n  run         run " + rootFile_name + " with nodespull\
            \n  stop        stop nodespull servers: database, db_portal\
            \n  boot -c     start nodespull servers and run app in container: app, database, db_portal\
            \n  stop -c     stop all nodespull servers: app, database, db_portal\
            \n  build       build your app\
            \n  deploy      deploy your app and get a url\
            \n  status      show the status of servers\n");
                }
            });
        }
        /**
         * @param func function will run before starting server
         */
        beforeStart(func) { this._sys._beforeStart = func; }
        /**
         * @param func function will run after starting server
         */
        afterStart(func) { this._sys._afterStart = func; }
    }
    Server.isRunning = false;
    return Server;
})();
// Log requests to the console.
const logger = require("morgan");
app.use(logger("dev"));
// Set parser for incoming request data
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// api documentation
const loader_1 = __importDefault(require("./templates/swagger/loader"));
const log_1 = require("./etc/log");
loader_1.default(app);
/**
 * Module controller
 */
exports.npModule = npModuleController_1.npModuleController.handler;
exports.npRoute = npRouteController_1.npRouteController.handler;
exports.npService = npRouteController_1.npRouteController.handler;
/**
 * App server
 */
exports.appServer = app;
/**
 * Create a http route
 */
exports.route = new controller_2.Route(app);
exports.Router = exports.route;
exports.http = exports.route;
/**
 * Main module
 */
exports.server = new Server();
/**
 * Choose object to configure with custom values
 */
exports.config = {
    /**
     * Set JWT secret key - used for encryption
     */
    secretKey: (val) => jwt_1.JWT.secret = val,
    /**
     * Database configuration object as specified by (npm) Sequelize.
     * ```
     * $.config.database({
     *      username: "myExistingDB_username",
     *      passsord: "myExistingDB_password",
     *      host: "myExistingDB_host",
     *      database: "myExistingDB_databaseName",
     *      port: 0000 // the port from which database should be accessed
     * })
     * ```
     */
    database: (settings) => exports.db.config = settings,
    /**
     * cross-site configuration
     * @param {{[domain:string]:string, [methods:string]:string[]}[]} args domains and http methods allowed.
     * example:
     * ```
     * $.config.cors([
     *      {domain:"*", methods:"GET, POST"}
     * ])
     * ```
     */
    cors: (args) => {
        isCorsSet = true;
        let origins = [];
        for (let arg of args)
            origins.push(arg["domain"]);
        app.use((req, res, next) => {
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if (origins.includes("*")) {
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", args[origins.indexOf("*")]["methods"]);
            }
            else if (origins.includes(req.headers.origin)) {
                res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                res.setHeader("Access-Control-Allow-Methods", args[origins.indexOf(req.headers.origin)]["methods"]);
            }
            next();
        });
    }
};
let isCorsSet = false;
