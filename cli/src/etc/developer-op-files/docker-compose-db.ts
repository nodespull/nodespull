
export default function file(data:any){
    return `version: '3.1'

services:

    nodespull-db-server:
        image: mysql
        command: --default-authentication-plugin=mysql_native_password
        restart: always
        ports:
            - "${data.dbPort}:3306"
        environment:
            MYSQL_ROOT_PASSWORD: "nodespull-db-password" 
            MYSQL_DATABASE: "nodespull-db-database"

    nodespull-db-server-test:
        image: mysql
        command: --default-authentication-plugin=mysql_native_password
        restart: always
        ports:
            - "${data.dbPortTest}:3306"
        environment:
            MYSQL_ROOT_PASSWORD: "nodespull-db-password" 
            MYSQL_DATABASE: "nodespull-test-database"

    nodespull-db-portal:
        image: adminer
        restart: always
        ports:
            - ${data.dbConsoleport}:8080`
}