import {parseJSON} from "../../etc/system-tools/json"

const packageJSON = parseJSON("./package.json");

export default function(){
    return {
        "swagger": "2.0",
        "info": {
            "description": packageJSON.description,
            "version": packageJSON.version,
            "title": packageJSON.name,
            "license": {
                "name": packageJSON.license,
            }
        },
        "components":{
            "securitySchemes":{
                "jwt": {
                    "type":"http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                } 
            }  
        }
    };
}
