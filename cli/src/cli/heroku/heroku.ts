
import {cmd} from "../exe/exe.log"
import fs from "fs"
const randWords = require("random-words")


//log into heroku
export async function login(){
    await cmd("heroku", ["login","-i"], false);
}


//create app
export async function create(){
    await cmd("heroku", ["create"], false);
}

//push
export async function push(){
    await cmd("git", ["push","heroku","master"], false);
    await cmd("heroku", ["open"], false);
}