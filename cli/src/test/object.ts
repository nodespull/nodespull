

export class res{
    private _status:number|undefined;
    private _json:any;
    private _sendValue:string|boolean|undefined;

    clientResponse:Promise<boolean>;
    runTest:Function|undefined;
    
    constructor(){
        this.clientResponse = new Promise((resolve, reject)=>{
            this.runTest = resolve;
        })
    }

    toClient():Promise<boolean>{
        return this.clientResponse;
    }

    //setters
    send(text?:string):res{
        if(text) this._sendValue = text;
        else this._sendValue = true;
        if(this.runTest) this.runTest(); // run test
        return this;
    }
    json(json:any):res{
        this._json = json;
        return this;
    }
    status(number:number):res{
        this._status = number;
        return this;
    }

    //getters
    getStatusVal():number|undefined{
        return this._status
    }
    getJsonVal():any{
        return this._json;
    }
    getSendVal():string|boolean|undefined{
        return this._sendValue;
    }
}