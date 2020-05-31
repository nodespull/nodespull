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
const deployFileName = "deploy.md";
let packageJson;
let appName;
function deploy() {
    return __awaiter(this, void 0, void 0, function* () {
        //loadPackageJsonContent();
        yield heroku_1.herokuLogin();
        // if(packageJson["heroku-app"] && packageJson["heroku-app"] != "null"){
        //     await push(appName);
        // }else{
        //modifyPackageJson();
        yield heroku_1.herokuPush();
        //}
    });
}
exports.deploy = deploy;
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
