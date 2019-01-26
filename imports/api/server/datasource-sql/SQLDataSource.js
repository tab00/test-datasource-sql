//Adapted from https://github.com/cvburgess/SQLDataSource

import { DataSource } from "apollo-datasource"
export class SQLDataSource extends DataSource {
  initialize(config) {
    console.log(`config.context: ${JSON.stringify(config.context)}`)

    // this.context = config.context //error: Converting circular structure to JSON
    this.context = Object.assign({}, config.context) //clone instead of point to config.context

    this.db = this.knex

    import { SQLCache } from "/imports/api/server/datasource-sql/SQLCache.js"
    this.sqlCache = new SQLCache(config.cache, this.knex)

    this.getBatched = query => this.sqlCache.getBatched(query)
    this.getCached = (query, ttl) => this.sqlCache.getCached(query, ttl)
    this.getBatchedAndCached = (query, ttl) => this.sqlCache.getBatchedAndCached(query, ttl)
  }
}
