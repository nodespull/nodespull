
export default function del(path:string):string{
    return `{
    "${path}":{
        "delete":{
            "summary": "no summary",
            "description":"no description",
            "parameters":[],
            "tags":["${path.slice(1)}"],
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
}`
}