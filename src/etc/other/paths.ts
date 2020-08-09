

export class PathVar {
    static packageJson:string = process.argv[1].split("/").slice(0,-2).join("/")+"/package.json"
    static appModule:string = process.argv[1].split("/").slice(0,-1).join("/")+"/app"
    static dbModule:string = process.argv[1].split("/").slice(0,-1).join("/")+"/database"
    static appEnvModule:string = process.argv[1].split("/").slice(0,-1).join("/")+"/environment"
    static etc_os_dir:string =  process.argv[1].split("/").slice(0,-2).join("/")+"/.etc/os"
    static etc_var_dir:string =  process.argv[1].split("/").slice(0,-2).join("/")+"/.etc/var"
    static processEnv:string = process.argv[1].split("/").slice(0,-2).join("/")+"/config"

}