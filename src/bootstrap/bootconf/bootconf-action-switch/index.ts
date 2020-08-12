
import {UserActions} from "./interfaces"
import { NpServer } from "../.."
import { FilesLoader } from "../../../files-runner"
import * as cli from "../../../cli"
import { cmd } from "../../../cli/exe/exe.log"
import { deploy } from "../../../cli/deploy/deploy"
import { Migration } from "../../../database/migration"
import { Log } from "../../../etc/log"
import { initializeNodespull } from "../../../install"

export class NpUserActionSwitch {

    static dispatch(){

        let action = process.argv[2]

        switch(action){
            case(UserActions.serve):
                FilesLoader.All()
                NpServer.userRequestedServe()
                break
            case(UserActions.cli):
                FilesLoader.Database()//used to perform user cmd checks
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
                FilesLoader.Database()
                new Migration(process.argv[3], process.argv[4])
                break
            case(UserActions.init):
                initializeNodespull()
                break
            default:
                console.log("\n"+new Log("Action invalid. See options below:").FgRed().getValue()+" \n\
                \n  init        initialize nodespull app\
                \n  cli         open nodespull cli\
                \n  serve       start node.js server\
                \n  migrate     use with (up | down | freeze\
                \n  deploy      deploy your app and get a url\n");
        }

    }


}