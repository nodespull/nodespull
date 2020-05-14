"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const json_1 = require("../../etc/system-tools/json");
const packageJSON = json_1.parseJSON("./package.json");
function default_1() {
    return {
        "swagger": "2.0",
        "info": {
            "description": packageJSON.description,
            "version": packageJSON.version,
            "title": packageJSON.name,
            "license": {
                "name": packageJSON.license,
            }
        },
        "components": {
            "securitySchemes": {
                "jwt": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
        }
    };
}
exports.default = default_1;
