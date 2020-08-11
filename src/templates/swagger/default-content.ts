import {parseJSON} from "../../etc/system-tools/json"
import {PathVar} from "../../etc/other/paths"

const packageJSON = parseJSON(PathVar.packageJson);

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
