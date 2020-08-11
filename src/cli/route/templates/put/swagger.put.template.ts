
export default function put(path:string):string{
    return `{
    "${path}/{uuid}":{
        "put":{
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
                    "name":"uuid",
                    "in":"path",
                    "required":true,
                    "description":"no description",
                    "type":"integer"
                },
                {
                    "in": "body",
                    "name": "body",
                    "description": "no description",
                    "required": true,
                    "schema":{
                        "type": "object",
                        "properties":{
                            "key_example":{"type":"number"}
                            
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