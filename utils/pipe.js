"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.npPipe = void 0;
const log_1 = require("../etc/log");
let npPipe = /** @class */ (() => {
    class npPipe {
        static registerChannel(pipeChannel) {
            npPipe.channels[pipeChannel.req.pipeChannelId] = pipeChannel;
            npPipe.forwardFlow(pipeChannel, null); // start the flow
        }
        /** factory for client initial access */
        static handler(req, res) {
            return new PipeChannel(req, res);
        }
        /**
         * defines the flow of the pipe -- service call order
         */
        static forwardFlow(pipeChannel, data) {
            if (data instanceof Error) {
                if (!pipeChannel._ignoreExceptions) {
                    if (pipeChannel._forwardOnly)
                        pipeChannel._callback(null, data);
                    else
                        npPipe.backwardFlow(pipeChannel, data);
                }
            }
            else {
                let pipeFunction = pipeChannel._pipeFunctions.shift();
                if (pipeFunction) {
                    pipeChannel._consumed.push(pipeFunction);
                    pipeFunction.forward(pipeChannel.req, pipeChannel.res, (funcData) => { npPipe.forwardFlow(pipeChannel, funcData); }, //next
                    data);
                }
                else {
                    pipeChannel._callback(data, null);
                    delete npPipe.channels[pipeChannel.req.pipeChannelId];
                }
            }
        }
        static backwardFlow(pipeChannel, error) {
            let pipeFunction = pipeChannel._consumed.pop();
            if (pipeFunction)
                pipeFunction.backward(pipeChannel.req, pipeChannel.res, (funcData) => { npPipe.backwardFlow(pipeChannel, funcData); }, //next
                error);
            else {
                pipeChannel._callback(null, error);
                delete npPipe.channels[pipeChannel.req.pipeChannelId];
            }
        }
    }
    npPipe.channels = {}; // not used, just keeps track of running channels
    return npPipe;
})();
exports.npPipe = npPipe;
class PipeChannel {
    constructor(req, res) {
        this.req = req;
        this.res = res;
        this._forwardOnly = false;
        this._ignoreExceptions = false;
        this._pipeFunctions = [];
        this._consumed = []; // pipe services that ran forward
        this._callback = (result, error) => { };
        this.req.pipeChannelId = Date.now();
    }
    /**
     * list Pipe usable services to alter data
     * @param services
     */
    useServices(...services) {
        for (let serviceFunctions of services) {
            if (!serviceFunctions.forward || !serviceFunctions.backward) {
                new log_1.Log(`pipe service missisng 'forward' or 'backward' function`).throwError();
                process.exit(1);
            }
        }
        this._pipeFunctions = services;
        return this;
    }
    /**
     * run only forward functions in the pipe
     */
    forwardOnly() {
        this._forwardOnly = true;
        return this;
    }
    /**
     * do not stop pipe flow if an exception occurs
     */
    ignoreExceptions() {
        this._ignoreExceptions = true;
        return this;
    }
    /**
     * runs req and res objects through a list of pipe services
     */
    run(callback) {
        this._callback = callback;
        npPipe.registerChannel(this);
    }
}
