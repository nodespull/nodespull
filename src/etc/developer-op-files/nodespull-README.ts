
export default function file(data:any){
    return `# Nodespull Initialized

## How to Run Project using the \`pull\` command
* From the project root folder, run in terminal:  \`pull run\`
* use \`pull help\` in a terminal window to see available \`pull\` commands

------------------------------------------------

## How to Run Project using the \`node\` command
* From the project root folder, run in terminal:  \`node ${data.rootFile_name} <tag>\`
where \`<tag>\` can be:
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