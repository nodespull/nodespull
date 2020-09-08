
export default function head(path:string):string{
    return `{
    "${path}":{
        "head":{
            "summary": "no summary",
            "description":"no description",
            "parameters":[],
            "tags":["${path.slice(1)}"],
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