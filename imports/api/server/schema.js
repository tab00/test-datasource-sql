export const typeDefs = `
type Book {
  id: String
  title: String
  author: String
  idOfOwner: String
}

type Query {
  books: [Book]
}
`
