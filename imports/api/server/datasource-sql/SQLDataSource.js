//From https://github.com/cvburgess/SQLDataSource. //TODO: remove when datasource-sql package works

import { SQLCache } from "/imports/api/server/datasource-sql/SQLCache.js"
import { DataSource } from "apollo-datasource"
export class SQLDataSource extends DataSource {
  initialize(config) {
    console.log(`config.context: ${JSON.stringify(config.context, null, 2)}`)

    this.context = config.context
    this.db = this.knex

    this.sqlCache = new SQLCache(config.cache, this.knex)

    this.getBatched = query => this.sqlCache.getBatched(query)
    this.getCached = (query, ttl) => this.sqlCache.getCached(query, ttl)
    this.getBatchedAndCached = (query, ttl) => this.sqlCache.getBatchedAndCached(query, ttl)
  }
}
