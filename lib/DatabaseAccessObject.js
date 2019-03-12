const Model = require('./Model')
const DatabaseConnection = require('./DatabaseConnection') // eslint-disable-line
const WhereClause = require('./WhereClause') // eslint-disable-line

class DatabaseAccessObject extends Model {
  /**
   * @returns {DatabaseConnection}
   * @abstract
   */
  static getDatabaseConnection () { }
  /**
   * @abstract
   * @returns {string}
   */
  static getTableName () {}
  /**
   * @abstract
   * @returns {string}
   */
  static getPrimaryKey () {}

  /**
   * @param {*} transaction
   */
  async insert (transaction = undefined) {
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createInsertQuery(this.constructor.getTableName(), this.createAttributeMap())
    let result = await connection.sendQuery(query, transaction)
    let primaryKey = this.constructor.getPrimaryKey()
    if (typeof primaryKey === 'string') {
      this[primaryKey] = connection.parsePrimaryKeyFromResult(result)
    }
  }
  /**
   * @param {WhereClause} whereClause
   * @returns {DatabaseAccessObject[]}
   */
  static async find (whereClause = undefined) {
    let connection = this.getDatabaseConnection()
    let query = connection.createFindQuery(this.getTableName(), whereClause)
    let result = await connection.sendQuery(query)
    let attributeMaps = connection.parseAttributeMapsFromResult(result, this.getAttributeNames())
    let models = []
    for (let attributeMap of attributeMaps) {
      let model = new this()
      model.setAttributes(attributeMap)
      models.push(model)
    }
    return models
  }
  /**
   * @param {*} transaction
   * @returns {number}
   */
  async update (transaction = undefined) {
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createUpdateQuery(this.getTableName(), this.createAttributeMap())
    let result = await connection.sendQuery(query, transaction)
    return connection.parseUpdatedRowsFromResult(result)
  }
  /**
   * @param {*} transaction
   * @returns {number}
   */
  async delete (transaction = undefined) {
    let primaryKey = this.constructor.getPrimaryKey()
    let whereClause
    if (typeof primaryKey === 'string' &&
      typeof this[primaryKey] !== 'number' &&
      typeof this[primaryKey] !== 'string') {
      let attributeMap = this.createAttributeMap()
      let values = []
      for (let [attr, value] of attributeMap) {
        values.push(attr)
        values.push(value)
      }
      whereClause = new WhereClause(Array(attributeMap.size).fill('?? = ?').join(' AND '), values)
    } else {
      whereClause = new WhereClause('?? = ?', [primaryKey, this[primaryKey]])
    }
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createDeleteQuery(this.constructor.getTableName(), whereClause)
    let result = await connection.sendQuery(query, transaction)
    return connection.parseDeletedRowsFromResult(result)
  }
  /**
   * Insert on duplicate update
   * @param {*} transaction
   */
  async save (transaction = undefined) {
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createSaveQuery(this.constructor.getTableName(), this.createAttributeMap())
    let result = await connection.sendQuery(query, transaction)
    let primaryKey = this.constructor.getPrimaryKey()
    if (typeof primaryKey === 'string' &&
      typeof this[primaryKey] !== 'number' &&
      typeof this[primaryKey] !== 'string') {
      this[primaryKey] = connection.parsePrimaryKeyFromResult(result)
    }
  }
}

module.exports = DatabaseAccessObject
