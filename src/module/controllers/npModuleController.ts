import { npModule } from "../npmodule";
import { npModuleArgInterface } from "../models";

export class npModuleController{

    static registeredModules:npModule[] = []

    static handler(args:npModuleArgInterface):npModule{
        args.jwtProfile = args.useGuard
        let newModule = new npModule(args.name, args.loadRoutes, args.jwtProfile, args.imports)
        if(npModuleController.registeredModules.map(mod=>mod._name).includes(newModule._name)){
            let ind = npModuleController.registeredModules.map(mod=>mod._name).indexOf(newModule._name)
            npModuleController.registeredModules[ind] = newModule
        }
        else npModuleController.registeredModules.push(newModule)
        return newModule
    }

}

