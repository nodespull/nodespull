import readline from 'readline';
import { toUnicode } from "./string-toUnicode";

export let cliStack: string[] = [];

export function userInput(question: string): customStdinResponse {
    process.stdin.setEncoding('utf8');
    
    let cliStackIndex = cliStack.length;
    
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    
    process.stdin.on('data', listener);
    async function listener(key:any) {
        if (toUnicode(key) == "\\u001B\\u005B\\u0041") {
            writer((cliStackIndex < 1) ? 0: cliStackIndex - 1);
        } else if (toUnicode(key) == '\\u001B\\u005B\\u0042') {
            writer((cliStackIndex < cliStack.length) ? cliStackIndex + 1: cliStack.length);
        } else {
            process.stdin.removeListener('data', listener);
        }  
    }

    function writer(index:number){
        cliStackIndex = index
        rl.write(">>", { ctrl: true, name: 'u' });
        rl.write(cliStack[index]);  
    }

    let promise = new Promise(resolve => {
        rl.question(question, (ans: any) => {
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