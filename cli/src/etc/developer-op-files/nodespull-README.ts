
export default function file(data:any){
    return `# Nodespull Initialized

## How to Run Project
* From the project root folder, run in terminal:  \`nodemon ${data.rootFile_name} <tag>\`
    * \`init\`        initialize nodespull app
    * \`cli\`         open nodespull cli
    * \`boot\`        start nodespull servers: database, db_portal
    * \`run\`         run ${data.rootFile_name} with nodespull
    * \`stop\`        stop nodespull servers: database, db_portal
    * \`boot --prod\` start nodespull servers: app, database, db_portal
    * \`stop --prod\` stop nodespull servers: app, database, db_portal
    * \`status\`      show the status of servers 


## Access
* ${data.rootFile_name}: http://localhost:${data.serverPort}
* nodespull Database Portal: http://localhost:${data.dbConsoleport}
    * System: MySQL
    * Server: nodespull-db-server
    * Username: root
    * Password: nodespull-db-password
    * Database: nodespull-db-database
`
}