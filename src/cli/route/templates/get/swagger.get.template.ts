
export default function get(path:string):string{
    return `{
    "${path}":{
        "get":{
            "summary": "no summary",
            "description":"no description",
            "parameters":[],
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