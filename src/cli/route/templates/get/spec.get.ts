
export default function spec(path:string):string{
    let routeName = path.split("/").pop()// remove slash, get last 
    let fileName = path.split("/").join("."); // replace slashes with dots
    fileName = fileName.substr(1, fileName.length); // remove initial dot
    return `const $ = require("nodespull")
const Res = require("nodespull/test/object").res;
const runGET = require("./${fileName}.get").ctr
const assert = require("assert")
$.server.ready({mode: "run", 
database: "nodespull-test-database"});
describe("GET: ${path}", ()=>{

/** @type {Res} */ let res;
/** @type {any} */ let req;

beforeEach(function(){
    res = new Res();
    req = {
        session: {},
        params: {},
        query: {}
    };
    runGET(req,res);
})


it("should return status 200 and send 'works' message", function(){
    return res.toClient().then(_=>{

        assert.equal(res.getStatusVal(),200);
        assert.equal(res.getSendVal(), "get:${path} works");

    })
});




})`
}