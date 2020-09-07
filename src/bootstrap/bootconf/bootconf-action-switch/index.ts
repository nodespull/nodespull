
import {UserActions} from "./interfaces"
import { NpServer } from "../.."
import { FilesLoader } from "../../../files-runner"
import * as cli from "../../../cli"
import { cmd } from "../../../cli/exe/exe.log"
import { deploy } from "../../../cli/deploy/deploy"
import { Migration } from "../../../database/migration"
import { Log } from "../../../etc/log"
import { initializeNodespull } from "../../../install"
import { npModuleController } from "../../../module/controllers/npModuleController"
import { DatabaseConnectionController } from "../../../database/connection"

export class NpUserActionSwitch {

    static dispatch(){

        let action = process.argv[2]

        switch(action){
            case(UserActions.serve):
                FilesLoader.All()
                for(let mod of npModuleController.registeredModules){ //boot self-booted services
                    for(let srv of mod._selfBootedServices){
                        let jobRes
                        if(srv.default) jobRes = mod.__addService_selfBootCheck(srv, srv.default)
                        else jobRes = mod.__addService_selfBootCheck(srv, srv.functions)
                        mod._service[srv.selector] = jobRes // selector.func call returns a promise 
                    }
                }
                NpServer.userRequestedServe()
                break
            case(UserActions.cli):
                FilesLoader.All()//used to perform user cmd checks
                cli.start()
                break
            case(UserActions.test):
                FilesLoader.All()
                cmd("mocha",["./**/*.spec.js"])
                break
            case(UserActions.deploy):
                deploy()
                break
            case(UserActions.migrate):
                FilesLoader.Env()
                FilesLoader.Database()
                new Migration(process.argv[3], process.argv[4], process.argv[5] == "--readonly")
                break
            case(UserActions.init):
                initializeNodespull()
                break
            default:
                console.log("\n"+new Log("Action invalid. See options below:").FgRed().getValue()+" \n\
                \n  init        initialize nodespull app\
                \n  cli         open nodespull cli\
                \n  serve       start nodespull server\
                \n  migrate     use with (up | down | freeze) to update db schema\
                \n  deploy      deploy your app and get a url\n");
        }

    }


}