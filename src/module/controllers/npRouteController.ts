import { npRouteInterface, npModuleUserInterface } from "../models";

export class npRouteController{

    static handler(args:npRouteInterface):npModuleUserInterface{
        args.jwtProfile = args.useGuard
        args.loader._addAndLoadRoute(args)
        return args.loader.getSelfObject()
    }

}

