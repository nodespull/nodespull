
import fs from "fs"
import {cmd} from "./exe/exe.log";

//initialize git
export async function init(){
    await cmd("touch",[".gitignore"], false);
    fs.writeFile(".gitignore","node_modules/",()=>{});
    await cmd("git", ["init"], false);
}

export async function commit(){
    await cmd("git", ["add", "."], false);
    await cmd("git", ["commit","-m","np-auto"], false);
}