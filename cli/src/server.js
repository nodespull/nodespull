"use strict";
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
const install_1 = require("./install");
const cli_1 = require("./cli/cli");
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./database/controller"));
const tools_1 = require("./database/tools");
const controller_2 = require("./route/controller");
const jwt_1 = require("./route/auth/jwt");
const json_1 = require("./etc/system-tools/json");
const fs_1 = __importDefault(require("fs"));
const exe_log_1 = require("./cli/exe/exe.log");
const packageJson = json_1.parseJSON("./package.json");
const swaggerUi = require('swagger-ui-express');
exports.PORT = 8888;
exports.DB_PORT_TEST = 3332;
const app = express_1.default();
function startServer(port, after) {
    port = parseInt(process.env.PORT, 10) || port;
    app.listen(port, () => {
        console.log("\n\nApp Server Started at localhost:" + port + ". Open \"nodespull_README.md\" for details.");
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
class Server {
    constructor() {
        this._sys = {
            _beforeStart: new Function(),
            _afterStart: new Function(),
            _start(after) {
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
            controller_1.default.setup(isModeInstall, exports.db);
            if (!controller_2.Route._home_set)
                app.use("/", express_1.default.static(__dirname + '/public'));
            let flag = process.argv[2];
            let prod = process.argv[3] && process.argv[3] == "--prod";
            let run_setup = (flag && flag == "init") ? true : false;
            let run_dbImages_only = (flag && flag == "boot") ? true : false;
            let stop_dbImages_only = (flag && flag == "stop") ? true : false;
            let run_all_images = (flag && flag == "boot" && prod) ? true : false;
            let stop_all_images = (flag && flag == "stop" && prod) ? true : false;
            let runFlag = (flag && flag == "run") ? true : false;
            let status = (flag && flag == "status") ? true : false;
            let cliFlag = (flag && flag == "cli") ? true : false;
            let testFlag = (flag && flag == "test") ? true : false;
            if (run_setup) {
                install_1.install(rootFile_name, exports.PORT, true, setup_db, tools_1.DatabaseTools, controller_1.default); // install sql db image, db adminer, and dockerfile, + criticals
                packageJson["scripts"] = {
                    start: "node " + packageJson.main + " run",
                    test: "mocha app.modules/**/*.spec.js || true"
                };
                json_1.writeJSON("./package.json", packageJson);
            }
            else if (cliFlag) {
                cli_1.cli();
            }
            else if (testFlag) {
                exe_log_1.cmd("npm", ["test"]);
            }
            else if (run_all_images) {
                exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-all.yml", "up"], true);
            }
            else if (stop_all_images) {
                exe_log_1.cmd('docker-compose', ["-f", install_1.sys_dir + "/docker-compose-all.yml", "down"], true);
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
            else if (runFlag) {
                Server.isRunning = true;
                require("./fileRunner"); // now that sequelize obj is initialized, load routes, tables, and relations
                if (this._sys._beforeStart)
                    this._sys._beforeStart();
                yield this._sys._start(this._sys._afterStart);
            }
            else {
                console.log("\nTag missing. See options below: \n\
            \n  init        initialize nodespull app\
            \n  cli         open nodespull cli\
            \n  boot        start nodespull servers: database, db_portal\
            \n  run         run " + rootFile_name + " with nodespull\
            \n  stop        stop nodespull servers: database, db_portal\
            \n  boot --prod start nodespull servers: app, database, db_portal\
            \n  stop --prod stop nodespull servers: app, database, db_portal\
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
// Log requests to the console.
const logger = require("morgan");
app.use(logger("dev"));
// Set parser for incoming request data
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// x-site http header config
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // <-- UPDATE SECURITY
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
// api documentation
const swagger_1 = __importDefault(require("./templates/swagger"));
loadSwagger();
function loadSwagger() {
    if (!fs_1.default.existsSync("./nodespull/swagger.json")) {
        exe_log_1.cmd("mkdir", ["-p", "./nodespull"]);
        exe_log_1.cmd("touch", ["./nodespull/swagger.json"]);
        json_1.writeJSON("./nodespull/swagger.json", swagger_1.default());
    }
    let docs = json_1.parseJSON("./nodespull/swagger.json");
    if (docs.info.title + docs.info.license + docs.info.description + docs.info.version !=
        packageJson.name + packageJson.license + packageJson.description + packageJson.version) {
        docs.info.title = packageJson.name;
        docs.info.license = packageJson.license;
        docs.info.description = packageJson.description;
        docs.info.version = packageJson.version;
        json_1.writeJSON("./nodespull/swagger.json", docs);
    }
    app.use('/api-docs', function (req, res, next) {
        docs.host = req.get('host');
        req["swaggerDoc"] = docs;
        next();
    }, swaggerUi.serve, swaggerUi.setup());
}
/**
 * Create a http route
 */
exports.route = new controller_2.Route(app);
exports.Router = exports.route;
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
    database: (settings) => exports.db.config = settings
};
// async function cmd(cmd:string, options:string[],stream?:boolean){
//     let execa = require('execa');
//     if(stream){
//         const exe = execa(cmd, options)
//         exe.stdout.pipe(process.stdout);
//         exe.stderr.pipe(process.stderr);
//     }
//     else{
//         await (async () => {
//             const {stdout} = await execa(cmd, options);
//             console.log(stdout);
//         })();
//     }
// }
