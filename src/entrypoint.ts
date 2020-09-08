/**
 * ====================
 * NODESPULL ENTRYPOINT
 * ====================
 */
import { NpServer } from "./bootstrap"
import { NpUserConfig } from "./bootstrap/bootconf/bootconf-user-config"
import { Boot_Env } from "./bootstrap/boot-env"
import { npModuleController } from "./module/controllers/npModuleController"
import { npRouteController } from "./module/controllers/npRouteController"
import { npServiceController } from "./module/controllers/npServiceController"
import { npPipe } from "./utils/pipe"
import { npHttpInterface } from "./http/controller"
import { npDatabaseConnectionLoader } from "./database/user-loader"
import { DatabaseUserInterfaceController } from "./database/user-interface"
import { npAdapterUserInterface } from "./cloud-adapter"
import { AuthController } from "./crypt"
import { FilesLoader } from "./files-runner"
import express from "express"
import { UserActions } from "./bootstrap/bootconf/bootconf-action-switch/interfaces"
import sequelize from "sequelize"



// extends external express server
export function use(app:express.Application){
    NpServer.isExtension = true
    NpServer.expressApp = app
    process.argv[2] = UserActions.serve
    ready() // possible bug: already ran when the user imported 'server.js'
}


Boot_Env.ensureInstanceRunning() // load process and app variables to np
// NpServer.ensureExpressAppConfigs() // set express app basic configs


// trigger serve operations
export const ready = NpServer.userTriggeredAppLunch


// server configs
export const config = {
    server: NpUserConfig.server, 
    security: NpUserConfig.security
}


/**
 * controllers / interface providers
 */
export const npModule = npModuleController.handler
export const npRoute = npRouteController.handler
export const npService = npServiceController.handler
export const pipe = npPipe.handler
export const http = npHttpInterface
export const CloudAdapter = npAdapterUserInterface
export const setHomeRoute = NpServer.setHomeRoute
export const npLink = {
    database: npDatabaseConnectionLoader.register
}
export const npEnv = { //env loaders
    process: Boot_Env.npEnv.process,
    app: Boot_Env.npEnv.app
}
export const npAuthProfile = {
    jwt: AuthController.jwt,
    oauth2: AuthController.oauth2
}
export const link = {
    get: (dbLinkSelector:string)=>{ // could be generalized later-on
        return DatabaseUserInterfaceController.interfaces[dbLinkSelector]
    }
}
export const filter = sequelize.Op




/**
 * nodespull started within the mocha process
 */
if(process.argv[1].split("/").pop() == "mocha") FilesLoader.All()
