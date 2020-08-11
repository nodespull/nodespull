"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.npJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const log_1 = require("../../etc/log");
const __1 = require("..");
class npJWT {
    constructor(_args) {
        this._args = _args;
    }
    /**
     * a JWT Guard is used to protect a route or all routes in a npModule.
     * it will require that a bearer jwt, created with this profile, be passed in the Authorization
     * field of the request's header
     */
    getGuard() {
        return this;
    }
    /**
     * generate a jwt using this jwt profile
     * @param userData data to be stored in the token
     */
    createTokenWith(userData) {
        let token;
        switch (this._args.algorithm) {
            case (__1.JwtAlg.HS256): token = JWTAlgModel.HS256.sign(userData, this._args);
            default: token = JWTAlgModel.HS256.sign(userData, this._args);
        }
        return token;
    }
    /**
     * verify that a jwt is provided and is valid
     * use configs to decide next action: return to client or pass to route handler
     */
    verifyToken(req, res, next) {
        let checkConfigAndReply = (err, decoded) => {
            req["jwt"]["data"] = decoded;
            let completeTask = () => {
                if (err && !this._args.onError.continueToRoute) {
                    let response = res.status(this._args.onError.statusCode);
                    if (this._args.onError.json)
                        response.json(this._args.onError.json);
                    else
                        response.send();
                }
                else
                    next();
            };
            if (this._args.onFinish)
                this._args.onFinish(req, decoded, err, completeTask);
            else
                completeTask();
        };
        let authorization = req.header("Authorization");
        let token = authorization ? req.header("Authorization").split(" ")[1] : undefined; //remove 'Bearer'
        if (token) {
            switch (this._args.algorithm) {
                case (__1.JwtAlg.HS256): JWTAlgModel.HS256.verify(token, this._args, checkConfigAndReply);
                default: token = JWTAlgModel.HS256.verify(token, this._args, checkConfigAndReply);
            }
        }
        else
            checkConfigAndReply(new Error("Authorization Token not found"), null);
    }
    ;
}
exports.npJWT = npJWT;
/**
 * implementation of JWT algorithms
 */
let JWTAlgModel = /** @class */ (() => {
    class JWTAlgModel {
    }
    JWTAlgModel.HS256 = {
        beforeAll: (args) => {
            if (!args.secret)
                new log_1.Log("secret not provided for auth profile using jwt 'HS256'").throwError();
        },
        sign: (data, args) => {
            JWTAlgModel.HS256.beforeAll(args);
            return jsonwebtoken_1.default.sign(data, args.secret, { expiresIn: args.expiresIn.duration_sec });
        },
        verify: (token, args, callback) => {
            JWTAlgModel.HS256.beforeAll(args);
            jsonwebtoken_1.default.verify(token, args.secret, (err, decoded) => callback(err, decoded));
        }
    };
    return JWTAlgModel;
})();
