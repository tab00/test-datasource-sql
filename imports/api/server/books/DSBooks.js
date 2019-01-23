import knex from "knex"
const knex1 = knex({
  client: "sqlite3",
  connection: { filename: "./sqlite.db" },
  useNullAsDefault: true
})



import { SQLDataSource } from "datasource-sql" //error: Converting circular structure to JSON

//==============================================================================================================
//SQLDataSource

// import { InMemoryLRUCache } from "apollo-server-caching"
// import DataLoader from "dataloader"

// class SQLCache {
//   constructor(cache = new InMemoryLRUCache(), knex2) {
//     this.cache = cache
//     this.loader = new DataLoader(rawQueries => Promise.all(rawQueries.map(rawQuery => knex2.raw(rawQuery)))
//     )
//   }

//   async getBatched(query) {
//     const queryString = query.toString()
//     console.log(`queryString: ${JSON.stringify(queryString)}`)
//     // return this.loader.load(queryString).then(result => result && result.rows)
//     // return this.loader.load(queryString).then(result => {
//     //   console.log(`result: ${JSON.stringify(result)}`)
//     //   console.log(`result.rows: ${JSON.stringify(result.rows)}`)
//     //   // return result && result.rows
//     //   return result
//     // })
//     return await this.loader.load(queryString)
//   }

//   getCached(query, ttl) {
//     const queryString = query.toString()
//     const cacheKey = `sqlcache:${queryString}`

//     return this.cache.get(cacheKey).then((entry) => {
//       if (entry) return Promise.resolve(entry)
//       return query.then((rows) => {
//         if (rows) this.cache.set(cacheKey, rows, ttl)
//         return Promise.resolve(rows)
//       })
//     })
//   }

//   getBatchedAndCached(query, ttl) {
//     const queryString = query.toString()
//     const cacheKey = `sqlcache:${queryString}`

//     return this.cache.get(cacheKey).then((entry) => {
//       if (entry) return Promise.resolve(entry)
//       return this.loader
//         .load(queryString)
//         // .then(result => result && result.rows)
//         .then((rows) => {
//           if (rows) this.cache.set(cacheKey, rows, ttl)
//           return Promise.resolve(rows)
//         })
//     })
//   }
// }

// import { DataSource } from "apollo-datasource"
// class SQLDataSource extends DataSource {
//   initialize(config) {
//     // console.log(`config: ${JSON.stringify(config, null, 2)}`)
//     console.log(`config.context: ${JSON.stringify(config.context)}`)

//     // this.context = config.context
//     this.context = Object.assign({}, config.context)
//     this.db = this.knex

//     this.sqlCache = new SQLCache(config.cache, this.knex)
//     this.getBatched = query => this.sqlCache.getBatched(query)
//     this.getCached = (query, ttl) => this.sqlCache.getCached(query, ttl)
//     this.getBatchedAndCached = (query, ttl) => this.sqlCache.getBatchedAndCached(query, ttl)
//   }
// }

//==============================================================================================================


export class DSBooks extends SQLDataSource { //TODO: fix [GraphQL error]: Message: Converting circular structure to JSON, Location: [{"line":2,"column":3}], Path: books
  constructor() {
    super()
    this.knex = knex1 // Add your instance of Knex to the DataSource
  }

  async getBooks({ idOfOwner }) {
    console.log(`In data source function getBooks. idOfOwner: ${JSON.stringify(idOfOwner)}`)

    const query = knex1.select().from("books")

    const MINUTE = 60 * 1000

    return await query
    // return this.getBatched(query)
    // return this.getCached(query, MINUTE)
    // return this.getBatchedAndCached(query, MINUTE)
  }

  async bookAdd({ book }) {
    console.log(`In data source function bookAdd. book: ${JSON.stringify(book)}`)

    return await knex1("books").insert(book)
      .then(idArray => Object.assign(book, { id: idArray[0] }))
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

    knex1("books").insert({ title: "Jurassic Park", author: "Michael Crichton", idOfOwner: "f83kfw" })
      .then(idArray => console.log(`Inserted book. idArray: ${JSON.stringify(idArray)}`))

    return null //To prevent Warning: a promise was created in a handler
  })
  .then(() => {
    knex1.select().from("books")
      .then((books) => {
        console.log(`books: ${JSON.stringify(books)}`)
      })
    return null
  })
  .catch(error => console.log(error))
