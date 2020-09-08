import { Log } from "../../etc/log";
import _bootStore from "./bootconf-store";

export default {
    cors:{
        missing: ()=>{
            new Log("CORS config not set. please add (and edit if needed) the codes below to your 'server.js' file before calling $.server.ready():\n\n\
            \t$.config.cors([  {domain: '*', methods: 'POST, GET, DELETE, PUT, HEAD, OPTIONS'}  ])\n\n").throwWarn()
        }
    },
    express: {
        serverStarted: ()=>{
            new Log("\n-"+new Log(` server started at http://localhost:`+_bootStore.server.PORT).FgGreen().getValue()).printValue()
        }
    }
    
}