
let errors = {
    db:{
        modelNotSaved,
        missingWhere_for
    }
}
export default errors;


function modelNotSaved(){
    throw Error("Tried to get a Table before saving Tables to database")
}

function missingWhere_for(action:string){
    throw Error("Missing where expression before "+action);
}


export class Log { 

    constructor(private message:string){}

    setValue(message:string):Log{ this.message = message; return this}
    getValue():string{ return this.message }
    printValue():void { console.log(this.message)}
    
    throwError():void{ console.error("\x1b[31m",new Error(this.message), "\x1b[37m") }
    throwWarn():void{ console.warn("\x1b[33m", "\nWarn: "+this.message, "\x1b[37m") }

    FgRed():Log{ this.applyFgFormat("\x1b[31m"); return this }
    FgGreen():Log{ this.applyFgFormat("\x1b[32m"); return this}
    FgYellow():Log{ this.applyFgFormat("\x1b[33m"); return this}
    FgBlue():Log{ this.applyFgFormat("\x1b[34m"); return this}
    FgMagenta():Log{ this.applyFgFormat("\x1b[35m"); return this}
    FgCyan():Log{ this.applyFgFormat("\x1b[36m"); return this}
    FgWhite():Log{ this.applyFgFormat("\x1b[37m"); return this}

    BgRed():Log{ this.applyBgFormat("\x1b[41m"); return this }
    BgGreen():Log{ this.applyBgFormat("\x1b[42m"); return this}
    BgYellow():Log{ this.applyBgFormat("\x1b[43m"); return this}
    BgBlue():Log{ this.applyBgFormat("\x1b[44m"); return this}
    BgMagenta():Log{ this.applyBgFormat("\x1b[45m"); return this}
    BgCyan():Log{ this.applyBgFormat("\x1b[46m"); return this}
    BgWhite():Log{ this.applyBgFormat("\x1b[47m"); return this}

    private applyFgFormat(format:string):string{ return format+this.message+"\x1b[37m"; }
    private applyBgFormat(format:string):string{ return format+this.message+"\x1b[40m"; }
}


