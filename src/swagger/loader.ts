
import swagger_defaultContent from "./templates/master"
import swagger from "swagger-ui-express"
import fs from "fs"
import { writeJSON, parseJSON } from "../etc/system-tools/json"
import { cmd } from "../cli/exe/exe.log"
import { PathVar } from "../etc/other/paths"
import { npModuleController } from "../module/controllers/npModuleController"
import { NpServer } from "../bootstrap"
import bootconfStore from "../bootstrap/bootconf/bootconf-store"


export class SwaggerController {
    static mainSwagger: any = {}
    static path: string = "/swagger"

    static buildMaster() {
        if (!fs.existsSync(PathVar.getEtc_var_dir() + "/swagger.json")) {
            cmd("mkdir", ["-p", PathVar.getEtc_var_dir()]);
            cmd("touch", [PathVar.getEtc_var_dir() + "/swagger.json"]);
            writeJSON(PathVar.getEtc_var_dir() + "/swagger.json", swagger_defaultContent());
        }
        try {
            let docs: any;
            docs = parseJSON(PathVar.getEtc_var_dir() + "/swagger.json");
            //build swager file
            SwaggerController.recursiveBuild(PathVar.getAppModule());
            if (JSON.stringify(docs) != JSON.stringify({ ...swagger_defaultContent(), ...SwaggerController.mainSwagger })) {
                writeJSON(PathVar.getEtc_var_dir() + "/swagger.json", { ...swagger_defaultContent(), ...SwaggerController.mainSwagger });
            }
            //load swagger file
            docs = parseJSON(PathVar.getEtc_var_dir() + "/swagger.json");
            if(bootconfStore.server.IS_SWAGGER_ACTIVE) NpServer.expressApp.use(SwaggerController.path, function (req: any, res: any, next: any) {
                docs.host = req.get('host');
                req["swaggerDoc"] = docs;
                next();
            }, swagger.serve, swagger.setup());
        } catch{
            console.log(`swagger file has invalid format. Please delete file at "${PathVar.getEtc_var_dir()}/swagger.json" and try again`)
        }
    }



    /**
     * run all .js file recursively, given a folder
     */
    static pathNames:string[] = []
    static recursiveBuild(path: string) {
        try {
            const dirents = fs.readdirSync(path, { withFileTypes: true });

            const fileNames: string[] = dirents
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name);

            const folderNames: string[] = dirents
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            for (let folderName of folderNames) SwaggerController.recursiveBuild(path + "/" + folderName);
            for (let fileName of fileNames) {
                if (fileName != "swagger.json") continue;
                let swaggerFile = parseJSON(path + "/" + fileName);
                let pathName = Object.keys(swaggerFile)[0];
                let method = swaggerFile[pathName][0]
                let [paramsStringified, paramsList, hasJwt] = SwaggerController.getRouteStatus(swaggerFile, pathName)
                let pathName_withParams = pathName + paramsStringified
                if (pathName_withParams != pathName) {
                    swaggerFile[pathName_withParams] = swaggerFile[pathName]
                    delete swaggerFile[pathName]
                }
                if (hasJwt) {
                    swaggerFile[pathName_withParams][Object.keys(swaggerFile[pathName_withParams])[0]]["security"] = [{ "jwt": ["admin"] }]
                    swaggerFile[pathName_withParams][Object.keys(swaggerFile[pathName_withParams])[0]]["parameters"].unshift({
                        "name": "Authorization",
                        "in": "header",
                        "required": true,
                        "description": "JWT token - Bearer",
                        "type": "string"
                    })
                }
                if (paramsList != []) for (let param of paramsList as Array<string>)
                    swaggerFile[pathName_withParams][Object.keys(swaggerFile[pathName_withParams])[0]]["parameters"].push({
                        "name": param,
                        "in": "path",
                        "required": true,
                        "description": "no description",
                        "type": "string"
                    })
                if (SwaggerController.pathNames.includes(pathName_withParams)) {
                    SwaggerController.mainSwagger["paths"][pathName_withParams] = { ...SwaggerController.mainSwagger["paths"][pathName_withParams], ...swaggerFile[pathName_withParams] };
                }
                else {
                    SwaggerController.mainSwagger["paths"] = { ...SwaggerController.mainSwagger["paths"], ...swaggerFile };
                    SwaggerController.pathNames.push(pathName_withParams);
                }
            }
        }
        catch{ }
    }


    static getRouteStatus(swaggerObject: any, pathName: string) {
        let registeredRouteKey = Object.keys(swaggerObject[pathName])[0].toUpperCase() + ":/" + pathName.split("/").slice(1).join("/")
        let route = null
        let hasJwt = false
        let isActive = false
        for (let module of npModuleController.registeredModules) route = module._route[registeredRouteKey] || route
        if (!route) throw "swagger failed to find registered route " + pathName
        hasJwt = route.jwtProfile != null
        isActive = route.isRouteActive || false
        let params = ""
        for (let param of route.urlParams) params += "/{" + param + "}"
        return [params, route.urlParams, isActive, hasJwt]
    }
}



