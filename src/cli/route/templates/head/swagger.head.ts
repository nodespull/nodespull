
export default function head(path:string):string{
    return `{
    "${path}":{
        "head":{
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
                }

                
            ],
            "responses":{
                "200":{
                    "description":"success"
                },
                "401":{
                    "description":"Unauthorized"
                },
                "500":{
                    "description":"Server error"
                }
            }
        }
    }
}`
}