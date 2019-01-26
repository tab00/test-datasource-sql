export const apolloServerInit = () => {
  import { ApolloServer } from "apollo-server-express"
  import { typeDefs } from "/imports/api/server/schema.js"
  import { resolvers } from "/imports/api/server/resolvers.js"
  import { DSBooks } from "/imports/api/server/books/DSBooks.js"
  import { getUser } from "meteor/apollo"

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
      dsBooks: new DSBooks()
    }),
    context: async ({ req, connection }) => {
      if (connection) { // check connection for metadata
        // console.log(`connection: ${JSON.stringify(connection)}`)

        const token = req.headers.authorization || ""
        return { token }
      } // check from req
      // const token = req.headers.authorization || ""
      // return { token }

      console.log(`req.headers.authorization: ${JSON.stringify(req.headers.authorization)}`)
      return { user: await getUser(req.headers.authorization) }
    },
  })


  import { WebApp } from "meteor/webapp"
  server.applyMiddleware({ app: WebApp.connectHandlers }) //path option defaults to /graphql
  WebApp.connectHandlers.use("/graphql", (req, res) => { if (req.method === "GET") res.end() }) // To prevent server-side exception "Can't set headers after they are sent" because GraphQL Playground (accessible in browser via /graphql) sets headers and WebApp also sets headers
}
