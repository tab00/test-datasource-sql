import React, { Component } from "react"

class Books extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    import { Query } from "react-apollo"
    import gql from "graphql-tag"

    const queryBooks = gql`query books {
      books {
        id
        title
        author
        idOfOwner
      }                              
    }`

    return (
      <>
        <Query
          query={queryBooks}
          //variables={{ }}
          // fetchPolicy="network-only"
          errorPolicy="all"
        // onCompleted={(data) => {
        //   console.log(`Query Completed. data: ${JSON.stringify(data)}`)
        // }}
        >
          {({ loading: loading0, error: error0, data }) => {
            import Loading from "./Loading.jsx"
            if (loading0) return <Loading />
            if (error0) return <p>Query error: {error0}</p>

            console.log(`Books: ${JSON.stringify(data)}`)

            return (
              <>
                <h2>Books</h2>
                <ul>
                  {data.books.map(book => (
                    <li key={book.id}>{book.id}. {book.author} - {book.title}, {book.idOfOwner}</li>
                  ))
                  }
                </ul>
              </>
            )
          }}
        </Query>
      </>
    )
  }
}

export default Books
