import knex from "knex"
const knex1 = knex({
  client: "sqlite3",
  connection: { filename: "./sqlite.db" },
  useNullAsDefault: true
})

// import { SQLDataSource } from "datasource-sql" // https://github.com/cvburgess/SQLDataSource. error: Converting circular structure to JSON
import { SQLDataSource } from "/imports/api/server/datasource-sql/SQLDataSource.js" //TODO: remove when datasource-sql package works

export class DSBooks extends SQLDataSource {
  constructor() {
    super()
    this.knex = knex1 // Add your instance of Knex to the DataSource
  }

  async getBooks({ idOfOwner }) {
    console.log(`In data source function getBooks. idOfOwner: ${JSON.stringify(idOfOwner)}`)

    const query = knex1.select().from("books")

    const MINUTE = 60 * 1000

    return await query
    return this.getBatched(query)
    return this.getCached(query, MINUTE)
    return this.getBatchedAndCached(query, MINUTE)
  }
}


export const booksTableInit = async () => knex1.schema.createTable("books", (table) => {
  table.increments()
  table.string("title")
  table.string("author")
  table.string("idOfOwner")
})
  .then(() => {
    knex1("books").insert({ title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", idOfOwner: "f892jkf3" })
      .then(idArray => console.log(`Inserted book. idArray: ${JSON.stringify(idArray)}`))

    return knex1("books").insert({ title: "Jurassic Park", author: "Michael Crichton", idOfOwner: "f83kfw" })
      .then(idArray => console.log(`Inserted book. idArray: ${JSON.stringify(idArray)}`))
  })
  .then(() => knex1.select().from("books")
      .then((books) => {
        console.log(`books: ${JSON.stringify(books)}`)

        return books.length > 0
      }))
  .catch(error => console.log(error))
