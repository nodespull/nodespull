# nodespull

An interface to help you configure and run stable and scalable Node.js api servers in minutes. With single-line commands, nodespull can implement JWT-based authentication, server routing, database modeling, and allocate local ports to launch your app (and database).

## Installation

Before installing nodespull, make sure that you have the following:
* Unix-based OS (e.g. macOS or Linux)
* Install and start Docker using [Docker Desktop](https://hub.docker.com/editions/community/docker-ce-desktop-mac). Although you will not be working with Docker directly, note that this is a nodespull dependency used to containerize your application. 

Download and install the nodespull package from npm:
```
npm init
npm i nodespull
```

Create your root file (e.g. `index.js`) and import the nodespull library:
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
This process will continue to run. Make sure that this terminal stays open to keep your database up and running.  

On a new terminal, you can run `node <rootFile> status` to verify that `db-portal` and `db-server` are up and running on specific ports. 

### 3) Start your app server
Nodespull also integrates [nodemon](https://www.npmjs.com/package/nodemon) to detect file changes and automatically restart your app server when needed.

Open terminal and run the following command:
```
nodemon <rootFile> run
```
You should now be able to access the app server and the db portal with the default information below or specified in the `nodespull-README.md` file. 
* App Server: *http://localhost:8888*
* Database Portal : *http://localhost:8889*

## nodespull CLI
With single-line commands, you can easily create tables and routes using nodespull CLI! To get started, run the following command:
```
node <rootFile> cli
``` 
### 1) Creating a table

There are two ways to create a table:

* With an auto-generated primary key, named `id`:
    ```
    create table <tableName>
    ```

* With a custom primary key, where `type` can either be `int` or `string`:
    ```
    create table <tableName> <attribute>:<type>
    ```
After running either of the above commands, you should see the `/app.modules/tables/<tableName>` folder with the following files: 
* `<tableName>.model.js` to specify table attributes
* `<tableName>.relation.js` to define table relations 

You can also check out your Database Portal to see your new table!

For more information, see the following tutorials:
* [Custom configurations for you database](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Setting up your data model](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Table relations](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Working with the Database Portal](https://github.com/kab-zac/nodespull/blob/master/Pending)

### 2) Creating a route
Nodespull CLI also makes it easy for you to build your service endpoints by creating a route. JWT-based authentication is also supported!
```
create route <routeName>
```
After running the above command, you should see `/app.modules/route/<routeName>` with the following folders to help you build RESTful routes:
* `<routeName>.delete`
* `<routeName>.get`
* `<routeName>.head`
* `<routeName>.post`
* `<routeName>.put`

Each folder contains a `.js`.  file for the route controller and a `.spec` file for your tests.

You will find the following default configurations within the route controller file:
```
isActive = false,
isProtected = false,
urlParams = [ undefined ],
path = "/<routeName>"
```

* `isActive` activates your route. Setting the value to `true` makes the route available to users. 
* `isProtected` provides and extra layer of security for the route. Setting the value to `true` would require your users to send a **Bearer Token** in the request header, see [JWT Session](https://github.com/kab-zac/nodespull/blob/master/Pending) for more information.
* `urlParams` defines path parameters.

Nodespull also integrates [Swagger](https://swagger.io/) in your application. Check out `<serverUrl>/api-docs` to view all your service endpoints.

For more information, see the following tutorials:
* [A simple GET method](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Routes with path and query params](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Protected routes ](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Working with your data](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Testing your routes](https://github.com/kab-zac/nodespull/blob/master/Pending)

## Testing
To test your routes and table connections, nodespull makes it easy for you to run end-to-end tests using [Mocha](https://mochajs.org/) and [Chai](https://www.chaijs.com/). 
* Make sure that your app server is not running. 
* In your terminal, run the command:

     ```
      node <rootFile> test
     ```

For more information, see the following tutorials:
* [Testing with nodespull](https://github.com/kab-zac/nodespull/blob/master/Pending)

## Other Resources
You should now be a little bit more familiar with Nodespull! But we still have so much more to share with you! Please feel free to explore our tutorials:
* [Creating a login system](https://github.com/kab-zac/nodespull/blob/master/Pending)
* [Working with Swagger](https://github.com/kab-zac/nodespull/blob/master/Pending)

To contact us, please feel free to create an issue through GitHub!
