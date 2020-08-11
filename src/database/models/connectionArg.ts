
export interface DbConnectionArg {
    isActive: boolean,
    system: string,
    selector: string,
    database: string,
    host: string,
    port: string|number,
    username: string,
    password: string
}