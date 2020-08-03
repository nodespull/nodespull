"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function del(path) {
    return `{
    "${path}/{uuid}":{
        "delete":{
            "summary": "no summary",
            "description":"no description",
            "security": [ {"jwt":["admin"]} ],
            "parameters":[
                {
                    "name":"Authorization",
                    "in":"header",
                    "required":true,
                    "description":"JWT token - Bearer",
                    "type":"string"
                },
                {
                    "name":"id",
                    "in":"path",
                    "required":true,
                    "description":"no description",
                    "type":"integer"
                }


            ],
            "responses":{
                "204":{
                    "description":"success",
                    "content":{
                        
                    }
                },
                "401":{
                    "description":"Unauthorized"
                },
                "500":{
                    "description":"Server error",
                    "content":{
                        "application/json":{
                            "err":{"type":"string"}
                        }
                    }
                }
            }
        }
    }
}`;
}
exports.default = del;
