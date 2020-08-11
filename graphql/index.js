"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQL = void 0;
// import expressGraphql from "express-graphql"
let GraphQL = /** @class */ (() => {
    class GraphQL {
        static setup(app) {
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
    GraphQL.isActive = false;
    GraphQL.path = "/graphql";
    return GraphQL;
})();
exports.GraphQL = GraphQL;
