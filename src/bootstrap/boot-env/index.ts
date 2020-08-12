import { Env_FilesLoader } from "../../files-runner/env-files"
import { npEnv_interface } from "./interfaces"
import { EnvType } from "./interfaces"
import { EnvCollector } from "./collector"


export class Boot_Env {

    static hasBooted:boolean = false
    static npEnv: npEnv_interface

    static ensureInstanceRunning (){
        if(Boot_Env.hasBooted) return //global already loaded
        Boot_Env.npEnv = {
            process: new EnvCollector(EnvType.process),
            app: new EnvCollector(EnvType.app)
        }
        // new Env_FilesLoader()
        Boot_Env.hasBooted = true
    }
    
}