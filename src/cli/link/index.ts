import { error } from ".."
import {newDB} from "./database/db"



export async function newLink(args:string[]){

    let type:string = args[0]
    let name:string = args[1]
    if(!type || !name) throw error.wrongUsage

    switch(type){
        case("--db"):
            newDB(name)
            break;
        default:
            throw error.wrongUsage
    }
}

