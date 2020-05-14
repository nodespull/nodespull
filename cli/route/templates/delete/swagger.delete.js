"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function del(path) {
    return `{
    "${path}/{id}":{
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
                "200":{
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
