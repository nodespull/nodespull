"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleController = void 0;
const module_1 = require("./module");
const log_1 = require("../etc/log");
let ModuleController = /** @class */ (() => {
    class ModuleController {
        constructor() { }
        static getCallableInstance() { return new ModuleController().hanlder; }
        /**
         * main handler
         */
        hanlder(arg) {
            if (!arg) {
                new log_1.Log("module constructor called without argument").throwError();
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
                new log_1.Log("module constructor invoked with invalid argument(s)").throwError();
            }
            //return module data if source exists
            if (ModuleController.isModuleRegistered(arg.source))
                return {
                    /** @type {{[name:string]: Function}} */ func: ModuleController.registeredModules[arg.source].getFunctions(),
                    /** @type {{[name:string]: PipeFunction}} */ pipefunc: ModuleController.registeredModules[arg.source].getPipeFunctions(),
                    /** @type {npModule} */ scope: ModuleController.registeredModules[arg.source]
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
                new log_1.Log(`duplicate module with name "${arg.name}". Pointer not updated`).throwError();
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
         * called only after all modules have been loaded - also used to clean the module-file tree
         */
        static addPipeFunction(arg) {
            //remove parent-placeholder modules if not already
            if (ModuleController.isLoadingModules) {
                ModuleController.isLoadingModules = false;
                ModuleController.pruneModules();
            }
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
                        new log_1.Log(`cannot find parent module "${moduleName}", pointer set to null`).throwError();
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
