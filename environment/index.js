"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppEnv = exports.ProcessEnv = void 0;
const string_validator_1 = require("../etc/system-tools/string-validator");
class ProcessEnv {
    constructor() { }
    loadVars(tags, vars) {
        if (tags.includes(process.argv.join(" ").split("--").slice(-1)[0]))
            for (let vName of Object.keys(vars)) {
                if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                    process.env[vName] = String(vars[vName]);
                }
            }
    }
}
exports.ProcessEnv = ProcessEnv;
let AppEnv = /** @class */ (() => {
    class AppEnv {
        constructor() { }
        loadVars(tags, vars) {
            if (tags.includes(process.argv.join(" ").split("--").slice(-1)[0]))
                for (let vName of Object.keys(vars)) {
                    if (string_validator_1.StringParser.isExtendedAlphaNum(vName)) {
                        AppEnv.var[vName] = String(vars[vName]);
                    }
                }
        }
    }
    AppEnv.var = {};
    return AppEnv;
})();
exports.AppEnv = AppEnv;
