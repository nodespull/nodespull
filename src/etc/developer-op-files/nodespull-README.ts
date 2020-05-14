
export default function file(data:any){
    return `# Nodespull Initialized

## How to Run Project
* From the project root folder, run in terminal:  \`nodemon ${data.rootFile_name} <tag>\`
    * \`init\`        initialize nodespull app
    * \`cli\`         open nodespull cli
    * \`boot\`        start nodespull servers: database, db_portal
    * \`run\`         run ${data.rootFile_name} with nodespull
    * \`stop\`        stop nodespull servers: database, db_portal
    * \`boot -c\`     containerize and run your nodespull app with nodespull servers
    * \`stop -c\`     stop your app container and nodespull dependencies
    * \`build\`       build a docker image for the app
    * \`deploy\`      deploy your app and get a url
    * \`status\`      show the status of servers 


## Access
* ${data.rootFile_name}: http://localhost:${data.serverPort}
* nodespull Database Portal, available after \`boot\`: http://localhost:${data.dbConsoleport}
    * System: MySQL
    * Server: nodespull-db-server
    * Username: root
    * Password: nodespull-db-password
    * Database: nodespull-db-database
`
}