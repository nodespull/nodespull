"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvType = exports.AppEnv = exports.EnvCollector = void 0;
const string_validator_1 = require("../etc/system-tools/string-validator");
// export class ProcessEnv {
//     constructor(){}
//     loadVars(userTags:string[], userVarsMap: {[varName:string]:string}):void{
//         let collectedVars = Common.getVarsMap(userTags, userVarsMap)
//         process.env = {...process.env, ...collectedVars}
//     }
// }
// export class AppEnv {
//     private collectedVars:any = {}
//     constructor(){}
//     loadVars(userTags:string[], userVarsMap: {[varName:string]:string}):void{
//         let res = Common.getVarsMap(userTags,userVarsMap)
//         this.collectedVars = res!={}?{...this.collectedVars, ...res}:this.collectedVars
//     }
//     getCollectedVars(){
//         return this.collectedVars
//     }
// }
class EnvCollector {
    constructor(envType) {
        this.envType = envType;
    }
    loadVars(userTags, varsMap) {
        let collectedVars = {};
        let processTag = process.argv.join(" ").split("--").length == 1 ? undefined : process.argv.join(" ").split("--").slice(-1)[0];
        if (processTag && userTags.includes(processTag))
            for (let vName of Object.keys(varsMap)) { // any tags that match
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    collectedVars[vName] = String(varsMap[vName]);
                }
            }
        else if (!processTag && userTags.length == 0)
            for (let vName of Object.keys(varsMap)) { // local
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    collectedVars[vName] = String(varsMap[vName]);
                }
            }
        if (this.envType == EnvType.process)
            process.env = Object.assign(Object.assign({}, process.env), collectedVars);
        if (this.envType == EnvType.app)
            AppEnv.storedVars = Object.assign(Object.assign({}, AppEnv.storedVars), collectedVars);
    }
}
exports.EnvCollector = EnvCollector;
// class Common{
//     static getVarsMap(userTags:string[], varsMap: {[varName:string]:string}):any{
//         let collectedVars:any = {}
//         let processTag:string|undefined = process.argv.join(" ").split("--").slice(-1).length==1?undefined:process.argv.join(" ").split("--").slice(-1)[0]
//         if(processTag && userTags.includes(processTag)) for(let vName of Object.keys(varsMap)){ // any tags that match
//             if(StringParser.isExtendedAlphaNum(vName)){
//                 collectedVars[vName] = String(varsMap[vName])
//             }
//         }
//         else if(!processTag && userTags.length == 0) for(let vName of Object.keys(varsMap)){ // local
//             if(StringParser.isExtendedAlphaNum(vName)){
//                 collectedVars[vName] = String(varsMap[vName])
//             }
//         }
//         return collectedVars
//     }
// }
let AppEnv = /** @class */ (() => {
    class AppEnv {
    }
    AppEnv.storedVars = {};
    return AppEnv;
})();
exports.AppEnv = AppEnv;
var EnvType;
(function (EnvType) {
    EnvType[EnvType["process"] = 0] = "process";
    EnvType[EnvType["app"] = 1] = "app";
})(EnvType = exports.EnvType || (exports.EnvType = {}));
