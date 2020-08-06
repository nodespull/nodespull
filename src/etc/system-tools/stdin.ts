import readline from 'readline';

export function userInput(question:string):customStdinResponse {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    let promise =  new Promise(resolve =>{
        rl.question(question, (ans:any) => {
            rl.close();
            resolve(ans);
        })
    });
    let toReturn = {
        _promise:promise,
        getPromise: ()=>{return toReturn["_promise"]},
        interface: rl
    }
    return toReturn
}

export interface customStdinResponse {
    _promise: Promise<any>
    getPromise: Function
    interface: readline.Interface
}