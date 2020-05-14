"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function file(data) {
    return `version: '3.1'

services:

    ${data.rootFile_name}:
        image: nodespull
        build:
            context: ../
            dockerfile: Dockerfile
        command: npm run dev
        volumes:
            - ..:/usr/app/
            - ../usr/app/node_modules
        ports:
            - "${data.serverPort}:8000"
        depends_on:
            - "nodespull-db-server"
        command: ["./${data.sys_dir}/wait-for-it.sh", "nodespull-db-server:3306", "-t","${data.serverWaitTime_forDB}", "--","node","${data.rootFile_name}","-r"]

    nodespull-db-server:
        image: mysql
        command: --default-authentication-plugin=mysql_native_password
        restart: always
        ports:
            - "3306:3306"
        environment:
            MYSQL_ROOT_PASSWORD: "nodespull-db-password" 
            MYSQL_DATABASE: "nodespull-db-database"

    nodespull-db-portal:
        image: adminer
        restart: always
        ports:
            - ${data.dbConsoleport}:8080`;
}
exports.default = file;
