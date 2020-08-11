import { Application } from "express";
// import expressGraphql from "express-graphql"

export class GraphQL {
    static isActive:boolean = false
    static path:string = "/graphql"

    static setup(app:Application){

        // let graphqlSchema
        // let graphqlResolver

        // app.use(GraphQL.path, expressGraphql.graphqlHTTP({
        //     schema: graphqlSchema,
        //     rootValue: graphqlResolver,
        //     graphiql: true,
        //     formatError: (err)=>{
        //         if(!err.originalError) return err
        //         const data = err.originalError.data
        //         const message = err.message
        //         const code = err.originalError.code || 500
        //         return {message, status:code, data}
        //     }
        // })
        // )

    }

}