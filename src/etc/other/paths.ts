

export class PathVar {

    static isProcessFromMocha = process.argv[1].split("/").pop() == "mocha"
    static isProcessFromRoot = PathVar.isProcessFromMocha

    static getPackageJson = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/package.json"
        return process.argv[1].split("/").slice(0,-2).join("/")+"/package.json"
    }
    static getAppModule = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/src/app"
        return process.argv[1].split("/").slice(0,-1).join("/")+"/app"
    }
    static getDbModule = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/src/database"
        return process.argv[1].split("/").slice(0,-1).join("/")+"/database"
    }
    static getAppEnvModule = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/src/environment"
        return process.argv[1].split("/").slice(0,-1).join("/")+"/environment"
    }
    static getEtc_os_dir = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/.etc/os"
        return process.argv[1].split("/").slice(0,-2).join("/")+"/.etc/os"
    }
    static getEtc_var_dir = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/.etc/var"
        return process.argv[1].split("/").slice(0,-2).join("/")+"/.etc/var"
    }
    static getProcessEnv = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/config"
        return process.argv[1].split("/").slice(0,-2).join("/")+"/config"
    }
    static getSrc = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/src"
        return process.argv[1].split("/").slice(0,-2).join("/")+"/src"
    }
    static getRoot = ():string=>{
        if(PathVar.isProcessFromRoot) return process.cwd()+"/"
        return process.argv[1].split("/").slice(0,-2).join("/")
    }

}