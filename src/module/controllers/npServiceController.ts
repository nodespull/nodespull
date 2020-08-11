import { npModuleUserInterface, npServiceInterface } from "../models";

export class npServiceController{

    static handler(args:npServiceInterface):npModuleUserInterface{
        args.loader._addService(args)
        return args.loader.getSelfObject()
    }

}

