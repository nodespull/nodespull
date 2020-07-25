import { npServiceInterface, npServicePipeFunction } from "../module/v2-module/models";
import { Log } from "../etc/log";


export class npPipe{

    static channels:any = {} // not used, just keeps track of running channels

    static registerChannel(pipeChannel:PipeChannel){
        npPipe.channels[pipeChannel.req.pipeChannelId] = pipeChannel
        npPipe.forwardFlow(pipeChannel, null) // start the flow
    }

    /** factory for client initial access */
    static handler(req:Request, res:Response){
        return new PipeChannel(req, res)
    }

    /**
     * defines the flow of the pipe -- service call order
     */
    static forwardFlow(pipeChannel:PipeChannel, data:any){
        if(data instanceof Error){
            if(!pipeChannel._ignoreExceptions){
                if(pipeChannel._forwardOnly) pipeChannel._callback(null, data)
                else npPipe.backwardFlow(pipeChannel, data)
            }
        }
        else{
            let pipeFunction = pipeChannel._pipeFunctions.shift()
            if(pipeFunction){
                pipeChannel._consumed.push(pipeFunction)
                pipeFunction.forward(
                    pipeChannel.req, 
                    pipeChannel.res, 
                    (funcData:any)=>{npPipe.forwardFlow(pipeChannel, funcData)}, //next
                    data
                )
            }
            else {
                pipeChannel._callback(data, null)
                delete npPipe.channels[pipeChannel.req.pipeChannelId]
            }
        }
    }

    static backwardFlow(pipeChannel:PipeChannel, error:Error){
        let pipeFunction = pipeChannel._consumed.pop()
        if(pipeFunction) pipeFunction.backward(
            pipeChannel.req, 
            pipeChannel.res, 
            (funcData:Error)=>{npPipe.backwardFlow(pipeChannel, funcData)}, //next
            error)
        else {
            pipeChannel._callback(null, error)
            delete npPipe.channels[pipeChannel.req.pipeChannelId]
        }
    }
}





class PipeChannel {
    public _forwardOnly: boolean = false
    public _ignoreExceptions: boolean = false
    public _pipeFunctions:npServicePipeFunction[] = []
    public _consumed: npServicePipeFunction[] = [] // pipe services that ran forward
    public _callback:Function = (result:any,error:Error)=>{}
    constructor(public req:Request|any, public res:Response){
        this.req.pipeChannelId = Date.now()
    }

    /**
     * list Pipe usable services to alter data
     * @param services
     */
    useServices(...services: npServicePipeFunction[]):PipeChannel{
        for(let serviceFunctions of services) {
            if(!serviceFunctions.forward || !serviceFunctions.backward){
                new Log(`pipe service missisng 'forward' or 'backward' function`).throwError()
                process.exit(1)
            }
        }
        this._pipeFunctions = services
        return this
    }

    /**
     * run only forward functions in the pipe
     */
    forwardOnly():PipeChannel{
        this._forwardOnly = true; return this
    }

    /**
     * do not stop pipe flow if an exception occurs
     */
    ignoreExceptions():PipeChannel{
        this._ignoreExceptions = true; return this
    }

    /**
     * runs req and res objects through a list of pipe services
     */
    run(callback:Function){
        this._callback = callback
        npPipe.registerChannel(this)
    }
}