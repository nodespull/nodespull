import fs from "fs"

export function parseJSON(pathFromRootFile:string){
    return JSON.parse(fs.readFileSync(pathFromRootFile, 'utf8'));
}

export function writeJSON(pathFromRootFile:string, json:any){
    fs.writeFileSync(pathFromRootFile, JSON.stringify(json));
}