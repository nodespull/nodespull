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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deploy = void 0;
const heroku_1 = require("../heroku/heroku");
const log_1 = require("../../etc/log");
const deployFileName = "deploy.md";
let packageJson;
let appName;
function deploy() {
    return __awaiter(this, void 0, void 0, function* () {
        let target = process.argv[3];
        if (!target || target == "undefined")
            new log_1.Log("Err: target cloud vendor not provided").FgRed().printValue();
        else
            switch (target) {
                case ("heroku"): {
                    new log_1.Log("\nPreparing for dev deployment to Heroku.").FgGreen().printValue();
                    new log_1.Log("\nNote: visit 'https://nodespull/prod' to learn about nodespull prod deploy\n").FgYellow().printValue();
                    yield heroku_1.herokuLogin();
                    yield heroku_1.herokuPush();
                    break;
                }
                default:
                    new log_1.Log(`cloud vendor '${target}' is not supported`).throwWarn();
            }
        //loadPackageJsonContent();
        // await herokuLogin();
        // if(packageJson["heroku-app"] && packageJson["heroku-app"] != "null"){
        //     await push(appName);
        // }else{
        //modifyPackageJson();
        // await herokuPush();
        //}
    });
}
exports.deploy = deploy;
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// function loadPackageJsonContent(){
//     packageJson = parseJSON("./package.json");
//     appName = packageJson.name+"-"+getRandNumber();
// }
// function modifyPackageJson(){
//     packageJson.scripts["start"] = "node "+packageJson.main+" run";
//     packageJson["heroku-app"] = appName;
//     writeJSON("./package.json", packageJson);
// }
// function getRandNumber(max?:number, min?:number){
//     max = max?max:1000;
//     min = min?min:100;
//     let rand = min+ Math.round(Math.random()* (max-min));
//     return rand;
// }
