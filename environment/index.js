"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnv = exports.ProcessEnv = void 0;
const string_validator_1 = require("../etc/system-tools/string-validator");
class ProcessEnv {
    constructor() { }
    loadVars(tags, vars) {
        let processTag = process.argv.join(" ").split("--").slice(-1).length == 1 ? undefined : process.argv.join(" ").split("--").slice(-1)[0];
        if (processTag && tags.includes(processTag))
            for (let vName of Object.keys(vars)) {
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    process.env[vName] = String(vars[vName]);
                }
            }
        else if (!processTag && tags.length == 0)
            for (let vName of Object.keys(vars)) {
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    process.env[vName] = String(vars[vName]);
                }
            }
    }
}
exports.ProcessEnv = ProcessEnv;
class AppEnv {
    constructor() {
        this.var = {};
    }
    loadVars(tags, vars) {
        let processTag = process.argv.join(" ").split("--").slice(-1).length == 1 ? undefined : process.argv.join(" ").split("--").slice(-1)[0];
        if (processTag && tags.includes(processTag))
            for (let vName of Object.keys(vars)) {
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    this.var[vName] = String(vars[vName]);
                }
            }
        else if (!processTag && tags.length == 0)
            for (let vName of Object.keys(vars)) {
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    this.var[vName] = String(vars[vName]);
                }
            }
    }
}
exports.AppEnv = AppEnv;
