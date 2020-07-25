import {install, sys_dir, appModule} from "./install"
import * as cli from "./cli/cli"
import express from "express";
import DB_Controller from "./database/controller";
import { DatabaseTools, DatabaseToolsFactory } from "./database/tools";
import { Route } from "./route/controller"
import {JWT} from "./route/auth/jwt";
import {parseJSON, writeJSON} from "./etc/system-tools/json"
import fs from "fs"
import {cmd} from "./cli/exe/exe.log"
import {deploy} from "./cli/deploy/deploy"
import { npModuleController } from "./module/v2-module/controllers/npModuleController"
import { npRouteController } from "./module/v2-module/controllers/npRouteController"
import { npServiceController } from "./module/v2-module/controllers/npServiceController"


import { Migration } from "./database/migration"

const packageJson = parseJSON("./package.json");


export let PORT = 8888;
export let DB_PORT_TEST = 3332;


const app:express.Application = express();
let noDatabase:boolean = false;


function startServer(port:number, after?:Function){
    // check that cors configurations are set
    if(!isCorsSet) new Log('CORS config not set. please add (and edit if needed) the codes below to your "'+packageJson.main+'" file before calling $.server.ready():\n\n\
    \t$.config.cors([  {domain: "*", methods: "POST, GET, DELETE, PUT, HEAD, OPTIONS"}  ])\n\n').throwWarn()
    port = parseInt(process.env.PORT!, 10) || port;
    app.listen(port, ()=>{
        new Log("\n\nApp Server Started at http://localhost:"+port+"\n Open \"nodespull_README.md\" for details.").FgGreen().printValue()
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
            if(!noDatabase) DB_Controller.connect();
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
        if(args && args.use_database === false) noDatabase = true;

        if(!Route._home_set)app.use("/",express.static(__dirname + '/public'))
        let flag = process.argv[2];
        let prod = process.argv[3] && process.argv[3] == "-c";
        let run_setup = (flag && flag == "init")?true:false;
        let run_dbImages_only = (flag && flag=="boot")?true:false;
        let stop_dbImages_only = (flag && flag=="stop")?true:false;
        let run_all_images = (flag && flag=="boot" && prod)?true:false;
        let stop_all_images = (flag && flag=="stop" && prod)?true:false;
        let buildFlag = (flag && flag=="build")?true:false;
        let runFlag = (flag && flag=="run")?true:false;
        let runFlag_fromContainer = (flag && flag=="docker-run")?true:false;
        let status = (flag && flag=="status")?true:false;
        let cliFlag = (flag && flag == "cli")?true:false;
        let doFlag = (flag && flag == "do")?true:false; // runs in nodespull cli
        let testFlag = (flag && flag == "test")?true:false;
        let deployFlag = (flag && flag == "deploy")?true:false;
        let migrateFlag = (flag && flag == "migrate")?true:false;

        if(runFlag_fromContainer){
            db.config.host = "nodespull-db-server";
            db.config.port = "3306"
        }
        DB_Controller.setup(isModeInstall, db);

        if (run_setup){
            install(rootFile_name,PORT, true, setup_db, DatabaseTools, DB_Controller); // install sql db image, db adminer, and dockerfile, + criticals
            packageJson["scripts"] = {
                start: "node "+rootFile_name+" run",
                test: "mocha "+appModule+"/**/*.spec.js || true"
            }
            packageJson["main"] = rootFile_name;
            writeJSON("./package.json",packageJson);
        }else if (cliFlag){
            cli.start();
        }else if (doFlag){
            cli.getCmd(process.argv[3], false)
        }else if (testFlag){
            cmd("npm",["test"]);
        }else if (run_all_images){
            cmd('docker', [ "stop","nodespull_"+rootFile_name+"_1"], false);
            cmd('docker', ["rm","nodespull_"+rootFile_name+"_1"], false);
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-all.yml","up","--build"],true);
        }else if (stop_all_images){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-all.yml","down"],true);
        }else if(buildFlag){
            cmd('docker-compose', ["-f", sys_dir + "/docker-compose-all.yml", "build"], false)
        }else if(run_dbImages_only){
            console.log("\n\n Wait until no new event, then open a new terminal to run your app.\n\n\n")
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-db.yml","up",], true);
        }else if(stop_dbImages_only){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-db.yml","down"], true);
        }else if (status){
            cmd('docker-compose', ["-f",sys_dir+"/docker-compose-all.yml","ps"], true);
        }else if(runFlag || runFlag_fromContainer){
            Server.isRunning = true;
            require("./files-runner"); // now that sequelize obj is initialized, load routes, tables, and relations
            if(this._sys._beforeStart) this._sys._beforeStart();
            await this._sys._start(this._sys._afterStart);
        }else if(deployFlag){
            deploy();
        }else if(migrateFlag){
            new Migration(process.argv[3])
        }else{
            console.log("\nTag missing. See options below: \n\
            \n  init        initialize nodespull app\
            \n  cli         open nodespull cli\
            \n  boot        start nodespull servers: database, db_portal\
            \n  run         run "+rootFile_name+" with nodespull\
            \n  stop        stop nodespull servers: database, db_portal\
            \n  boot -c     start nodespull servers and run app in container: app, database, db_portal\
            \n  stop -c     stop all nodespull servers: app, database, db_portal\
            \n  migrate     use with (up | down | freeze)\
            \n  build       build your app\
            \n  deploy      deploy your app and get a url\
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
// api documentation
import swaggerLoader from "./templates/swagger/loader"
import { Log } from "./etc/log";
import { npPipe } from "./core/pipe";
swaggerLoader(app);



/**
 * Module controller
 */
export const npModule = npModuleController.handler
export const npRoute = npRouteController.handler
export const npService = npServiceController.handler


/**
 * Runs req and res objects through a series of np functions
 * @param {Request} req client request object
 * @param {Response} res client response object
 * Example:
 * ```
 *      Pipe(req, res).useServices( 
 *          func.myFunction1, 
 *          func.myFunction2
 *      ).run((result,error)=>{
 *          console.log(result)
 *      })
 * ```
 */
export const Pipe = npPipe.handler

/**
 * App server
 */
export const appServer = app


/**
 * Create a http route
 */
export const route = new Route(app);
export const Router = route;
export const http = route;


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
    database: (settings:any)=>db.config = settings,
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
    cors:(args:any)=>{
        isCorsSet = true;
        let origins: string[] = [];
        for(let arg of args) origins.push(arg["domain"]);
        app.use((req,res,next)=>{
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
            if(origins.includes("*")){
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", args[origins.indexOf("*")]["methods"]);
            }
            else if(origins.includes(req.headers.origin as string)){
                res.setHeader("Access-Control-Allow-Origin", req.headers.origin as string);
                res.setHeader("Access-Control-Allow-Methods", args[origins.indexOf(req.headers.origin as string)]["methods"]);
            }
            next()
        })
    }
}
let isCorsSet = false;



