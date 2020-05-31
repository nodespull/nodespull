"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadBrew = void 0;
const exe_1 = __importDefault(require("../exe/exe"));
// install brew
exports.downloadBrew = () => {
    exe_1.default("sudo", ["/bin/bash", "-c", "\"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)\""]);
};
