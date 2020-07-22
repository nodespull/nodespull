import fs from "fs"
import {appModule} from "../install"


// runner template
export abstract class FilesRunner {

    static rootPath = __dirname+`/../../../${appModule}/`

    constructor(){}

    /**
     * run all .js file recursively, given a folder
     */
    recursiveRun(path: string, extension:string){
        try{
            const dirents = fs.readdirSync(path, { withFileTypes: true });
    
            const fileNames:string[] = dirents
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name);
        
            const folderNames:string[] = dirents
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            
            for(let folderName of folderNames) this.recursiveRun(path+"/"+folderName, extension);
            for(let fileName of fileNames) {
                if(fileName.slice(-1*(extension.length+1)).toLowerCase() === "."+extension.toLowerCase()) require(path+"/"+fileName);
            }
        }
        catch{}
    }
}