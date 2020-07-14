"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleController = void 0;
const module_1 = require("./module");
let ModuleController = /** @class */ (() => {
    class ModuleController {
        constructor() { }
        static getCallableInstance() { return new ModuleController().hanlder; }
        /**
         * main handler
         */
        hanlder(arg) {
            if (!arg) {
                console.error("\x1b[31m", new Error("module constructor called without argument"), "\x1b[37m");
                return undefined;
            }
            let actionPerformed = false;
            if (arg.name)
                actionPerformed = ModuleController.createModule(arg);
            if (arg.source && arg.route)
                actionPerformed = ModuleController.addRoute(arg);
            if (arg.source && arg.functions)
                actionPerformed = ModuleController.addFunctions(arg);
            if (arg.source && arg.pipeFunction)
                actionPerformed = ModuleController.addPipeFunction(arg);
            // arguments not recognized
            if (!actionPerformed) {
                console.error("\x1b[31m", new Error("module constructor invoked with invalid argument(s)"), "\x1b[37m");
            }
            //return module data if source exists
            if (ModuleController.isModuleRegistered(arg.source))
                return {
                    func: ModuleController.registeredModules[arg.source].getFunctions(),
                    pipefunc: ModuleController.registeredModules[arg.source].getPipeFunctions(),
                    scope: ModuleController.registeredModules[arg.source]
                };
        }
        /**
         * register new module
         */
        static createModule(arg) {
            //create and register parent-placeholder for new module if not extst
            if (arg.parent != null && !ModuleController.isModuleRegistered(arg.parent)) {
                let newParentModule = new module_1.npModule(arg.parent, null, []);
                newParentModule.isParentPlaceholder = true;
                ModuleController.registeredModules[arg.parent] = newParentModule;
            }
            // new module has existing twin (which is Not another module's parent-placeholder)
            if (ModuleController.isModuleRegistered(arg.name) && !ModuleController.registeredModules[arg.name].isParentPlaceholder) { //duplicate
                console.error("\x1b[31m", new Error(`duplicate module with name "${arg.name}". Pointer not updated`), "\x1b[37m");
                return false;
            }
            // new module has existing twin as another module's parent-placeholder
            else if (ModuleController.isModuleRegistered(arg.name)) { // replace parent-placeholder module
                let newModule = new module_1.npModule(arg.name, arg.parent ? ModuleController.registeredModules[arg.parent] : null, ModuleController.registeredModules[arg.name].childModules);
                if (arg.isModuleActive != undefined)
                    newModule.setIsModuleActive(arg.isModuleActive);
                if (arg.isModuleProtected != undefined)
                    newModule.setIsModuleProtected(arg.isModuleProtected);
                ModuleController.registeredModules[arg.name] = newModule;
            }
            // new module does not have a registered twin
            else {
                let newModule = new module_1.npModule(arg.name, arg.parent ? ModuleController.registeredModules[arg.parent] : null, []);
                if (arg.isModuleActive != undefined)
                    newModule.setIsModuleActive(arg.isModuleActive);
                if (arg.isModuleProtected != undefined)
                    newModule.setIsModuleProtected(arg.isModuleProtected);
                ModuleController.registeredModules[newModule.name] = newModule;
            }
            return true;
        }
        /**
         * register route to module
         */
        static addRoute(arg) {
            if (!ModuleController.isModuleRegistered(arg.source))
                return false;
            ModuleController.registeredModules[arg.source].addAndLoadRoute(arg.route);
            return true;
        }
        /**
         * register functions to module
         * called only after all modules have been loaded - also used to clean the module-file tree
         */
        static addFunctions(arg) {
            //remove parent-placeholder modules if not already
            if (ModuleController.isLoadingModules) {
                ModuleController.isLoadingModules = false;
                ModuleController.pruneModules();
            }
            // register provided functions to a module
            if (!ModuleController.isModuleRegistered(arg.source))
                return false;
            for (let functionName of Object.keys(arg.functions)) {
                ModuleController.registeredModules[arg.source].addFunction(functionName, arg.functions[functionName]);
            }
            return true;
        }
        /**
         * register pipe functions to module
         */
        static addPipeFunction(arg) {
            // register provided functions to a module
            if (!ModuleController.isModuleRegistered(arg.source))
                return false;
            ModuleController.registeredModules[arg.source].addPipeFunction(arg.pipeFunction);
            return true;
        }
        static isModuleRegistered(moduleName) {
            if (!Object.keys(ModuleController.registeredModules).includes(moduleName))
                return false;
            return true;
        }
        static pruneModules() {
            for (let moduleName of Object.keys(ModuleController.registeredModules)) {
                if (ModuleController.registeredModules[moduleName].isParentPlaceholder) {
                    for (let childModule of ModuleController.registeredModules[moduleName].childModules) {
                        childModule.parentModule = null;
                        console.error("\x1b[31m", new Error(`cannot find parent module "${moduleName}", pointer set to null`), "\x1b[37m");
                    }
                }
            }
        }
    }
    ModuleController.registeredModules = {};
    ModuleController.isLoadingModules = true;
    return ModuleController;
})();
exports.ModuleController = ModuleController;
