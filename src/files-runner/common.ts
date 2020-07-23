import fs from "fs"
import {appModule} from "../install"


// runner template
export abstract class FilesEngine {

    static rootPath = __dirname+`/../../../${appModule}/`

    constructor(){}

    /**
     * run all .js file recursively, given a folder
     */
    recursiveSearch(path: string, extension:string, options:RecursiveSearchOptions):string[]{
        try{
            const dirents = fs.readdirSync(path, { withFileTypes: true });
    
            const fileNames:string[] = dirents
                .filter(dirent => dirent.isFile())
                .map(dirent => dirent.name);
        
            const folderNames:string[] = dirents
                .filter(dirent => !dirent.isFile())
                .map(dirent => dirent.name);
            
            let paths: string[] = []

            for(let folderName of folderNames) paths = [...paths, ...this.recursiveSearch(path+"/"+folderName, extension, options)];
            for(let fileName of fileNames) {
                if(fileName.slice(-1*(extension.length+1)).toLowerCase() === "."+extension.toLowerCase()){
                    if(options.runFiles) require(path+"/"+fileName);
                    paths.push(path+"/"+fileName)
                }
            }
            return paths
        }
        catch(e){ 
            console.error(e)
            return []
        }
    }

}

interface RecursiveSearchOptions {
    runFiles: boolean
}