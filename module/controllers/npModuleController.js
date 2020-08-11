"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npModuleController = void 0;
const npmodule_1 = require("../npmodule");
let npModuleController = /** @class */ (() => {
    class npModuleController {
        static handler(args) {
            args.jwtProfile = args.useGuard;
            let newModule = new npmodule_1.npModule(args.name, args.loadRoutes, args.jwtProfile, args.imports);
            npModuleController.registeredModules.push(newModule);
            return newModule;
        }
    }
    npModuleController.registeredModules = [];
    return npModuleController;
})();
exports.npModuleController = npModuleController;
