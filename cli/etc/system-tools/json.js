"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
function parseJSON(pathFromRootFile) {
    return JSON.parse(fs_1.default.readFileSync(pathFromRootFile, 'utf8'));
}
exports.parseJSON = parseJSON;
function writeJSON(pathFromRootFile, json) {
    fs_1.default.writeFileSync(pathFromRootFile, JSON.stringify(json));
}
exports.writeJSON = writeJSON;
