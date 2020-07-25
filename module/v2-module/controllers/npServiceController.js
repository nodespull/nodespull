"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npServiceController = void 0;
class npServiceController {
    static handler(args) {
        args.loader._addService(args);
        return args.loader.getSelfObject();
    }
}
exports.npServiceController = npServiceController;
