
import spawn from "cross-spawn"


export async function cmd(cmd:string, options:string[],stream?:boolean){
    if(stream){
        const child = spawn(cmd, options, { stdio: 'inherit' });
    }
    else{
        const result = spawn.sync(cmd, options, { stdio: 'inherit' });
    }
}