"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Route = void 0;
let Route = /** @class */ (() => {
    class Route {
        constructor(app) {
            this.app = app;
        }
        /**
         * For auto-generated routes
         */
        HEAD(args) {
            if (!args.isRouteActive)
                return;
            let params = "";
            if (args.urlParams[0])
                for (let param of args.urlParams)
                    params += "/:" + param;
            this.app.head(args.path + params, (req, res) => {
                if (args.jwtProfile) {
                    args.jwtProfile.verifyToken(req, res, () => {
                        args.handler(req, res);
                    });
                }
                else
                    args.handler(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        GET(args) {
            if (!args.isRouteActive)
                return;
            let params = "";
            if (args.urlParams[0])
                for (let param of args.urlParams)
                    params += "/:" + param;
            this.app.get(args.path + params, (req, res) => {
                if (args.jwtProfile) {
                    args.jwtProfile.verifyToken(req, res, () => {
                        args.handler(req, res);
                    });
                }
                else
                    args.handler(req, res);
            });
            if (args.path == "/" || args.path == "")
                Route.is_homePath_fromUser = true;
        }
        /**
         * For auto-generated routes
         */
        POST(args) {
            if (!args.isRouteActive)
                return;
            let params = "";
            if (args.urlParams[0])
                for (let param of args.urlParams)
                    params += "/:" + param;
            this.app.post(args.path + params, (req, res) => {
                if (args.jwtProfile) {
                    args.jwtProfile.verifyToken(req, res, () => {
                        args.handler(req, res);
                    });
                }
                else
                    args.handler(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        PUT(args) {
            if (!args.isRouteActive)
                return;
            let params = "";
            if (args.urlParams[0])
                for (let param of args.urlParams)
                    params += "/:" + param;
            this.app.put(args.path + params, (req, res) => {
                if (args.jwtProfile) {
                    args.jwtProfile.verifyToken(req, res, () => {
                        args.handler(req, res);
                    });
                }
                else
                    args.handler(req, res);
            });
        }
        /**
         * For auto-generated routes
         */
        DELETE(args) {
            if (!args.isRouteActive)
                return;
            let params = "";
            if (args.urlParams[0])
                for (let param of args.urlParams)
                    params += "/:" + param;
            this.app.delete(args.path + params, (req, res) => {
                if (args.jwtProfile) {
                    args.jwtProfile.verifyToken(req, res, () => {
                        args.handler(req, res);
                    });
                }
                else
                    args.handler(req, res);
            });
        }
    }
    // auth:Authentication;
    Route.is_homePath_fromUser = false;
    return Route;
})();
exports.Route = Route;
