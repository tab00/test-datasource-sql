//Adapted from https://github.com/cvburgess/SQLDataSource

import { InMemoryLRUCache } from "apollo-server-caching"
import DataLoader from "dataloader"

export class SQLCache {
  constructor(cache = new InMemoryLRUCache(), knex2) {
    this.cache = cache
    this.loader = new DataLoader(rawQueries => Promise.all(rawQueries.map(rawQuery => knex2.raw(rawQuery)))
    )
  }

  async getBatched(query) {
    const queryString = query.toString()
    console.log(`queryString: ${JSON.stringify(queryString)}`)
    // return this.loader.load(queryString).then(result => result && result.rows) //result.rows is undefined

    // return this.loader.load(queryString).then(result => {
    //   console.log(`result: ${JSON.stringify(result)}`)
    //   console.log(`result.rows: ${JSON.stringify(result.rows)}`) //an array is returned when using SQLite DB. rows is not a property of an array
    //   // return result && result.rows
    //   return result
    // })

    return await this.loader.load(queryString)
  }

  getCached(query, ttl) {
    const queryString = query.toString()
    const cacheKey = `sqlcache:${queryString}`

    return this.cache.get(cacheKey).then((entry) => {
      if (entry) return Promise.resolve(entry)
      return query.then((rows) => {
        if (rows) this.cache.set(cacheKey, rows, ttl)
        return Promise.resolve(rows)
      })
    })
  }

  getBatchedAndCached(query, ttl) {
    const queryString = query.toString()
    const cacheKey = `sqlcache:${queryString}`

    return this.cache.get(cacheKey).then((entry) => {
      if (entry) return Promise.resolve(entry)
      return this.loader
        .load(queryString)
        // .then(result => result && result.rows) //result.rows is undefined as rows is not a property of an array
        .then((rows) => {
          if (rows) this.cache.set(cacheKey, rows, ttl)
          return Promise.resolve(rows)
        })
    })
  }
}
