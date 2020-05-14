import readline from 'readline';

export default async function userInput(question:string):Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve =>{
        rl.question(question, (ans:any) => {
        rl.close();
        resolve(ans);
    })
    });
}