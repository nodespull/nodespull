import {install, sys_dir} from "./install"
import {cli} from "./cli/cli"
import express from "express";
import DB_Controller from "./database/controller";
import { DatabaseTools, DatabaseToolsFactory } from "./database/tools";
import { Route } from "./route/controller"
import {JWT} from "./route/auth/jwt";
import {parseJSON, writeJSON} from "./etc/system-tools/json"
import fs from "fs"
import {cmd} from "./cli/exe/exe.log"

const packageJson = parseJSON("./package.json");

const swaggerUi = require('swagger-ui-express');

export let PORT = 8888;
export let DB_PORT_TEST = 3332;



const app:express.Application = express();


function startServer(port:number, after?:Function){
    port = parseInt(process.env.PORT!, 10) || port;
    app.listen(port, ()=>{
        console.log("\n\nApp Server Started at localhost:"+port+". Open \"nodespull_README.md\" for details.");
        if(after) after(port);
    });
}



/* --------------- Developer Interface --------------- */


let rootFile_name:string = process.argv[1].split("/").pop()!;

let flag = process.argv[2];
let isModeInstall = (flag && flag == "init")?true:false;
/**
 * Main database module that trades with MySQL server using (npm) Sequelize
 */
export let db:DatabaseTools = new DatabaseTools(isModeInstall); //allows for intellisense, updated in setup_db
export let Database = db;
function setup_db(dbConstroller:any){
    db = DatabaseToolsFactory(isModeInstall);
    dbConstroller.setup(isModeInstall,db);
}

class Server {
    static isRunning = false;
    private _sys = {
        _beforeStart:new Function(),
        _afterStart:new Function(),
        _start( after?:Function):void{
            DB_Controller.connect();
            startServer(PORT, after);
        }
    };
    /**
     * Serve the node.js app on specified port.
     * @param port 
     */
    async ready(args:any){
        if(Server.isRunning) return;
        if(args && args.port) PORT = args.port;
        if(args && args.mode) process.argv[2] = args.mode;
        if(args && args.database){
            db.config.database = args.database;
            if(args.database == "nodespull-test-database") db.config.port = DB_PORT_TEST;
        }

        DB_Controller.setup(isModeInstall, db);

        if(!Route._home_set)app.use("/",express.static(__dirname + '/public'))
        let flag = process.argv[2];
        let prod = process.argv[3] && process.argv[3] == "--prod";
        let run_setup = (flag && flag == "init")?true:false;
        let run_dbImages_only = (flag && flag=="boot")?true:false;
        let stop_dbImages_only = (flag && flag=="stop")?true:false;
        let run_all_images = (flag && flag=="boot" && prod)?true:false;
        let stop_all_images = (flag && flag=="stop" && prod)?true:false;
        let runFlag = (flag && flag=="run")?true:false;
        let status = (flag && flag=="status")?true:false;
        let cliFlag = (flag && flag == "cli")?true:false;
        let testFlag = (flag && flag == "test")?true:false;
        if (run_setup){
            install(rootFile_name,PORT, true, setup_db, DatabaseTools, DB_Controller); // install sql db image, db adminer, and dockerfile, + criticals
            packageJson["scripts"] = {
                start: "node "+packageJson.main+" run",
                test: "mocha app.modules/**/*.spec.js || true"
            }
            writeJSON("./package.json",packageJson);
        }else if (cliFlag){
            cli();
        }else if (testFlag){
            cmd("npm",["test"]);
        }else if (run_all_images){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-all.yml","up"],true);
        }else if (stop_all_images){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-all.yml","down"],true);
        }else if(run_dbImages_only){
            console.log("\n\n Wait until no new event, then open a new terminal to run your app.\n\n\n")
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-db.yml","up",], true);
        }else if(stop_dbImages_only){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-db.yml","down"], true);
        }else if (status){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-all.yml","ps"], true);
        }else if(runFlag){
            Server.isRunning = true;
            require("./fileRunner"); // now that sequelize obj is initialized, load routes, tables, and relations
            if(this._sys._beforeStart) this._sys._beforeStart();
            await this._sys._start(this._sys._afterStart);
        }else{
            console.log("\nTag missing. See options below: \n\
            \n  init        initialize nodespull app\
            \n  cli         open nodespull cli\
            \n  boot        start nodespull servers: database, db_portal\
            \n  run         run "+rootFile_name+" with nodespull\
            \n  stop        stop nodespull servers: database, db_portal\
            \n  boot --prod start nodespull servers: app, database, db_portal\
            \n  stop --prod stop nodespull servers: app, database, db_portal\
            \n  status      show the status of servers\n");
        }
    }
    /**
     * @param func function will run before starting server
     */
    beforeStart(func:Function):void{this._sys._beforeStart = func;}
    /**
     * @param func function will run after starting server
     */
    afterStart(func:Function):void{this._sys._afterStart = func;}


}


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
import swaggerTemplate from "./templates/swagger"
loadSwagger();
function loadSwagger(){
    if(!fs.existsSync("./nodespull/swagger.json")){
        cmd("mkdir", ["-p","./nodespull"]);
        cmd("touch", ["./nodespull/swagger.json"]);
        writeJSON("./nodespull/swagger.json",swaggerTemplate());
    }
    let docs = parseJSON("./nodespull/swagger.json");
    if(docs.info.title+docs.info.license+docs.info.description+docs.info.version != 
        packageJson.name+packageJson.license+packageJson.description+packageJson.version){
        docs.info.title = packageJson.name;
        docs.info.license = packageJson.license;
        docs.info.description = packageJson.description;
        docs.info.version = packageJson.version;
        writeJSON("./nodespull/swagger.json",docs);
    }
    app.use('/api-docs', function(req:any, res, next){
        docs.host = req.get('host');
        req["swaggerDoc"] = docs;
        next();
    }, swaggerUi.serve, swaggerUi.setup());
}



/**
 * Create a http route
 */
export const route = new Route(app);
export const Router = route;


/**
 * Main module
 */
export const server = new Server();


/**
 * Choose object to configure with custom values
 */
export const config = {
    /**
     * Set JWT secret key - used for encryption
     */
    secretKey: (val:string)=>JWT.secret = val,
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
    database: (settings:any)=>db.config = settings
}


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


