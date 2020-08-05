

export class PathVar {
    static packageJson:string = process.argv[1].split("/").slice(0,-2).join("/")+"/package.json"

}