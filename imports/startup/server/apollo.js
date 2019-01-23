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
    // cache: new RedisCache({ host: "redis-server", }), // Options are passed through to the Redis client
    // context: async ({ req }) => ({ user: await getUser(req.headers.authorization) }),
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
    uploads: false, //To prevent error "Upload" defined in resolvers, but not in schema. Default is true, and ApolloServer then adds "Upload":"Upload" to resolvers
    // subscriptions: { //Doesn't work. client gets error "Cannot read property 'headers' of undefined". TODO: re-enable when fixed. In the meantime a new SubscriptionServer is created below
    //   path: "/subscriptions",
    //   onConnect: async (connectionParams, webSocket, context) => { //connectionParams has authToken that was set in WebSocketLink on client
    //     console.log(`Subscription client connected using built-in SubscriptionServer.`)
    //     console.log(`connectionParams: ${JSON.stringify(connectionParams)}`)

    //     if (connectionParams.authToken) return { user: await getUser(connectionParams.authToken) } //puts user into subscription context so that it can be used with withFilter()

    //     // throw new Error("Missing auth token. Please log in.")
    //   },
    //   onDisconnect: async (webSocket, context) => {
    //     console.log(`Subscription client disconnected.`)
    //   }
    // }
  })


  import { WebApp } from "meteor/webapp"
  server.applyMiddleware({ app: WebApp.connectHandlers }) //path option defaults to /graphql
  WebApp.connectHandlers.use("/graphql", (req, res) => { if (req.method === "GET") res.end() }) // To prevent server-side exception "Can't set headers after they are sent" because GraphQL Playground (accessible in browser via /graphql) sets headers and WebApp also sets headers
}
