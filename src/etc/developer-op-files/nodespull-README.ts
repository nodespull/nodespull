
export default function file(projectName:string){
    return `# ${projectName}

This project was generated with [Nodespull CLI](https://github.com/nodespull/nodespull-cli) version 1.0.0

## Local server

Run \`pull serve\` for a local server. Navigate to \`http://localhost:3000/\`. The server will automatically reload if you change any of the source files.

## Code scaffolding

Run \`pull i\` to open the interactive cli. Then you can use \`create route|service|profile|module|database|table\`. 
You can also run \`pull i docker\` to access the npdocker interactive cli. Use \`create/remove mysql|adminer\` to manage ready-to-use containers.

## Unit testing

Run \`pull test\` to execute the unit tests via [Mocha](https://mochajs.org/).

## End-to-end testing

No native support. Run e2e with custom implementation.

## Further help

To get more help on the Nodespull CLI use \`pull help\` or go check out the [Nodespull CLI documentation](http://nodespull.org/learn?at=docsCliOverview).

`
}