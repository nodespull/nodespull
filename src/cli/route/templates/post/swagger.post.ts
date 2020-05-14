
export default function post(path:string):string{
    return `{
    "${path}":{
        "post":{
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
                    "in": "body",
                    "name": "body",
                    "description": "no description",
                    "required": true,
                    "schema":{
                        "type": "object",
                        "properties":{
                            "id":{"type":"number"}
                            
                        }
                    }
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
}`
}