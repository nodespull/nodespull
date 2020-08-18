
export default function file(projectName:string){
    return `# ${projectName}

This project was generated with [Nodespull CLI](https://github.com/nodespull/nodespull-cli) version 1.0.0

## Development server

Run \`pull serve\` for a dev server. Navigate to \`http://localhost:3000/\`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run \`pull i\` to open the interactive cli. Then you can use \`create route|service|profile|module|database|table\`. 
You can also run \`pull i docker\` to access the npdocker interactive cli. Use \`create/remove mysql|adminer\` to scafold ready-to-use containers.

## Build

Run \`pull build\` to build a docker image of the project. The build artifact will be accessible via the docker cli. Use the \`--prod\` flag for a production build.

## Running unit tests

Run \`pull test\` to execute the unit tests via [Mocha](https://mochajs.org/).

## Running end-to-end tests

No native support. Run e2e with custom implementation.

## Further help

To get more help on the Nodespull CLI use \`pull help\` or go check out the [Nodespull CLI README](https://github.com/nodespull/nodespull-cli/blob/master/README.md).

`
}