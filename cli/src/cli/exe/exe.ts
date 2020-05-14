
export  default async function runCmd(cmd:string, options:string[],stream?:boolean){
    let execa = require('execa');
    if(stream){
        const exe = execa(cmd, options)
        //exe.stdout.pipe(process.stdout);
        //exe.stderr.pipe(process.stderr);
    }
    else{
        (async () => {
            const {stdout} = await execa(cmd, options);
            //console.log(stdout);
        })();
    }
}