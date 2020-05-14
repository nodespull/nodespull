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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const heroku_1 = require("./heroku/heroku");
const git_1 = require("./git");
const string_gen_1 = __importDefault(require("../etc/system-tools/string-gen"));
const json_1 = require("../etc/system-tools/json");
const deployFileName = "deploy.md";
let packageJson;
let appName;
function deploy(cliLoop) {
    return __awaiter(this, void 0, void 0, function* () {
        loadPackageJsonContent();
        if (packageJson["heroku-name"]) {
            yield git_1.init();
            yield heroku_1.login();
            yield git_1.commit();
            yield heroku_1.push();
        }
        else {
            modifyPackageJson();
            yield git_1.init();
            yield heroku_1.create();
            yield heroku_1.login();
            yield git_1.commit();
            yield heroku_1.push();
        }
        cliLoop();
    });
}
exports.deploy = deploy;
function loadPackageJsonContent() {
    packageJson = json_1.parseJSON("./package.json");
    appName = packageJson.name + "-" + string_gen_1.default(4);
}
function modifyPackageJson() {
    packageJson.scripts["start"] = "node " + packageJson.main + " run";
    packageJson["heroku-name"] = appName;
    json_1.writeJSON("./package.json", packageJson);
}
