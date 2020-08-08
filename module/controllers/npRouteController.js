"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npRouteController = void 0;
class npRouteController {
    static handler(args) {
        args.loader._addAndLoadRoute(args);
        return args.loader.getSelfObject();
    }
}
exports.npRouteController = npRouteController;
