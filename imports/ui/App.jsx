import React, { Component } from "react"

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }


  render() {
    import ApolloClient from "apollo-client"
    import { ApolloLink } from "apollo-link"
    import { MeteorAccountsLink } from "meteor/apollo"
    import { HttpLink } from "apollo-link-http"
    import { InMemoryCache } from "apollo-cache-inmemory"

    import { onError } from "apollo-link-error"
    const onErrorLink = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) graphQLErrors.map(({ message, locations, path }) => console.log(`[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(locations)}, Path: ${path}`))
      if (networkError) console.log(`[Network error]: ${JSON.stringify(networkError)}`)
    })

    const apolloClient = new ApolloClient({
      link: ApolloLink.from([
        onErrorLink,
        ApolloLink.from([
          new MeteorAccountsLink(),
          new HttpLink({ uri: "/graphql" })
        ])
      ]),
      cache: new InMemoryCache()
    })

    import { ApolloProvider } from "react-apollo"
    import Books from "./Books.jsx"

    return (
      <React.StrictMode>
        <ApolloProvider client={apolloClient}>
          <div className="App container-fluid">
            <div className="App-block row">
                <Books />
            </div>
          </div>
        </ApolloProvider>
      </React.StrictMode>
    )
  }
}

// export default App

import PropTypes from "prop-types"
App.propTypes = {
  userId: PropTypes.string,
  authToken: PropTypes.string,
}


import { withTracker } from "meteor/react-meteor-data" //create a container component which provides data from a Meteor collection to the React component. This allows React components to respond to data changes via Meteor’s Tracker reactivity system.
export default withTracker(() => {
  import { Meteor } from "meteor/meteor"
  return {
    userId: Meteor.userId(),
    authToken: global.localStorage["Meteor.loginToken"]
  }
})(App)
