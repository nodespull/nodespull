
import spawn from "cross-spawn"


export async function cmd(cmd:string, options:string[],stream?:boolean){
    if(stream !== undefined && stream === false){
        spawn(cmd, options);
    }
    else{
        const result = spawn.sync(cmd, options, { stdio: 'inherit' });
        return new Promise((resolve,reject)=>{
            if(result.error == null) resolve(result.output);
            reject(result.error);
        })
    }
}