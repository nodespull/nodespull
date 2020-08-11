import { npModule } from "../npmodule";
import { npModuleArgInterface } from "../models";

export class npModuleController{

    static registeredModules:npModule[] = []

    static handler(args:npModuleArgInterface):npModule{
        args.jwtProfile = args.useGuard
        let newModule = new npModule(args.name, args.loadRoutes, args.jwtProfile, args.imports)
        npModuleController.registeredModules.push(newModule)
        return newModule
    }

}

