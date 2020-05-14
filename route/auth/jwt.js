"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const string_gen_1 = __importDefault(require("../../etc/system-tools/string-gen"));
class JWT {
    constructor() {
    }
    static checkToken(req, res, cb) {
        let authorization = req.header("Authorization");
        let token = authorization ? req.header("Authorization").split(" ")[1] : undefined;
        if (token) {
            JWT.verify(token, JWT.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authorization Token is not valid'
                    });
                }
                else {
                    req["session"] = decoded;
                    cb();
                }
            });
        }
        else {
            return res.status(401).json({
                success: false,
                message: 'Authorization Token is not supplied'
            });
        }
    }
    ;
    static sign(data, duration) {
        return new JWT_Token(jsonwebtoken_1.default.sign(data, JWT.secret, { expiresIn: duration ? duration : JWT.duration }), duration ? duration : JWT.duration);
    }
}
exports.JWT = JWT;
JWT.verify = jsonwebtoken_1.default.verify;
JWT.secret = string_gen_1.default(30);
JWT.duration = "24h";
class JWT_Token {
    constructor(val, duration) {
        this.token = val;
        this.duration = duration;
    }
}
exports.JWT_Token = JWT_Token;
