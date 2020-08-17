import { npServiceInterface, npServicePipeFunction } from "../module/models";
import { Log } from "../etc/log";


export class npPipe{

    static channels:any = {} // not used, just keeps track of running channels

    static registerChannel(pipeChannel:PipeChannel){
        npPipe.channels[pipeChannel.id] = pipeChannel
        npPipe.forwardFlow(pipeChannel, pipeChannel.injectedData, null) // start the flow
    }

    /** factory for client initial access */
    static handler(pipeData:any){
        return new PipeChannel(pipeData)
    }

    /**
     * defines the flow of the pipe -- service call order
     */
    static forwardFlow(pipeChannel:PipeChannel, data:any, error?:Error|any|null){
        if(error){
            if(!pipeChannel._ignoreExceptions){
                if(pipeChannel._forwardOnly) pipeChannel._callback(data, error)
                else npPipe.backwardFlow(pipeChannel, data, error)
            }
        }
        else{
            let pipeFunction = pipeChannel._pipeFunctions.shift()
            if(pipeFunction){
                pipeChannel._consumed.push(pipeFunction)
                pipeFunction.forward(data, (funcData:any, error?:Error|any|null)=>{npPipe.forwardFlow(pipeChannel, funcData, error)}, //next
                )
            }
            else {
                pipeChannel._callback(data, error)
                delete npPipe.channels[pipeChannel.id]
            }
        }
    }

    static backwardFlow(pipeChannel:PipeChannel, data:any, error:Error|any){
        let pipeFunction = pipeChannel._consumed.pop()
        if(pipeFunction) pipeFunction.backward(
            data,
            (funcData:any, funcError?:Error|any|null)=>{npPipe.backwardFlow(pipeChannel, funcData, funcError)}, //next
            error)
        else {
            pipeChannel._callback(data, error)
            delete npPipe.channels[pipeChannel.id]
        }
    }
}





class PipeChannel {
    public _forwardOnly: boolean = false
    public _ignoreExceptions: boolean = false
    public _pipeFunctions:npServicePipeFunction[] = []
    public _consumed: npServicePipeFunction[] = [] // pipe services that ran forward
    public _callback:Function = (result:any,error:Error)=>{}
    public id:string
    constructor(public injectedData:any){
        this.id = Date.now().toString()
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