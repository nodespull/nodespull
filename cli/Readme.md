# nodespull

An interface to help you configure and run stable, scalable Node.js api servers in minutes.
With single-line commands, nodespull can implement JWT-based authentication, server routing, database modeling, and allocate local ports to launch your app (and database).

## Installation

Before installing nodespull, make sure that you have the following:
* Unix-based OS (e.g. macOS or Linux)
* Install and start Docker using [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac). Although you will not be working with Docker directly, note that this is a nodespull dependency used to containerize your application. 

Download and install the nodespull package from npm.
```
npm init
npm i nodespull
```

Create your root file (e.g. `index.js`) and import the nodespull library.
```
const $ = require("nodespull");

$.server.ready();
```

You are now ready to get started! 

## Getting Started

### 1) Initialize your nodespull app
```
node <rootFile> init
```
After running the command, you should expect to see `nodespull-README.md` and `/nodespull` folder in your project.

### 2) Boot up the database servers
```
node <rootFile> boot
```
You can run `node <rootFile> status` to verify that `db-portal` and `db-server` are up and running on specific ports. 

### 3) Start your app server
Nodespull also integrates [nodemon](https://www.npmjs.com/package/nodemon) to detect file changes and automatically restart your app server when needed. Run your app on a separate terminal than the one running your "boot" servers. Just make sure you are in the same directory.
```
nodemon <rootFile> run
```
Your app should now be up and running! You should be able to access the app server and the db portal with the default information below or specified in the `nodespull-README.md` file. 
* app server: *http://localhost:8888*
* db portal : *http://localhost:8889*


### 4) Tables and Routes
Use nodespull CLI to create tables and routes. Files are generated in the "app.module" folder.
```
node <rootFile> cli
```
Run ```help``` in the cli to view available commands.
<br/>
For generated routes, set ```isActive``` to ```true``` to activate a generated path.

### Testing
You can perform end-to-end testing with nodespull's mocha integration. Simply run
```
node <rootFile> test
```

### More
You can change the app server's port from your root file as follow
```
$.server.ready(myPortNumber)
```
If you wish to connect to a remote database server, you can insert configurations in your root file
```
$.db.config({
    username:"",
    password:"",
    host:"",
    port:""
})
$.server.ready(myPort)
```

<!-- ## Contributing
Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us. -->

## Authors
* **Isaac Kabuika** - [Isaackbn](https://github.com/kab-zac/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/kab-zac/nodespull/blob/master/LICENSE) file for details
