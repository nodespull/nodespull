
export default function put(path:string):string{
    return `{
    "${path}/{id}":{
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
                    "name":"id",
                    "in":"path",
                    "required":true,
                    "description":"no description",
                    "type":"integer"
                },
                {
                    "in": "body",
                    "name": "body",
                    "description": "art_object data",
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