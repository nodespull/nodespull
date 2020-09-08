
export default function post(path:string):string{
    return `{
    "${path}":{
        "post":{
            "summary": "no summary",
            "description":"no description",
            "parameters":[
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
            "tags":["${path.slice(1)}"],
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