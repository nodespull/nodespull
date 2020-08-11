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
exports.newAuthProfile = void 0;
const exe_log_1 = require("../exe/exe.log");
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("../../etc/other/paths");
const jwt_template_1 = __importDefault(require("./templates/jwt.template"));
const oauth2_template_1 = __importDefault(require("./templates/oauth2.template"));
const string_validator_1 = require("../../etc/system-tools/string-validator");
const log_1 = require("../../etc/log");
const __1 = require("..");
function newAuthProfile(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let profileType = args[0];
        let name = args[1];
        if (!profileType || !name)
            throw __1.error.wrongUsage;
        name = string_validator_1.StringParser.convertToExtendedAlphaNum_orThrow(name);
        if (profileType == "--jwt")
            newJWTAuthProfile(name);
        else if (profileType == "--oauth2")
            newOauth2AuthProfile(name);
        else
            throw new log_1.Log("ERR: auth profile type not recognized").FgRed().getValue();
    });
}
exports.newAuthProfile = newAuthProfile;
function newJWTAuthProfile(name) {
    let path = paths_1.PathVar.src + "/auth/jwt/" + name + ".jwt.js";
    exe_log_1.cmd("touch", [path]); // create module file
    fs_1.default.writeFile(path, jwt_template_1.default(name), () => { }); // populate module file with template
}
function newOauth2AuthProfile(name) {
    let path = paths_1.PathVar.src + "/auth/oauth2/" + name + ".oauth2.js";
    exe_log_1.cmd("touch", [path]); // create module file
    fs_1.default.writeFile(path, oauth2_template_1.default(name), () => { }); // populate module file with template
}
