import { npRouteInterface, npModuleUserInterface } from "../models";

export class npRouteController{

    static handler(args:npRouteInterface):npModuleUserInterface|null{
        args.jwtProfile = args.useGuard
        if(args.loader && args.loader._loadRoutes){
            args.loader._addAndLoadRoute(args)
            return args.loader.getSelfObject()
        }
        return null
    }

}

