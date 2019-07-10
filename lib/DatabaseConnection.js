/* eslint-disable no-unused-vars */
const WhereClause = require('./WhereClause')
const Join = require('./Join')
const TableShema = require('./tableShema/TableShema')
/* eslint-enable no-unused-vars */

/**
 * Defines a DatabaseConnection
 * @abstract
 */
class DatabaseConnection {
  /**
   * @param {*} config
   */
  constructor (config) {
    /**
     * @member {*}
     */
    this.config = config
  }
  /**
   * @returns {*} transaction
   * @abstract
   */
  async createTransaction () {}
  /**
   * @param {*} transaction
   * @abstract
   */
  async commitTransaction (transaction) {}
  /**
   * @param {*} transaction
   * @abstract
   */
  async rollbackTransaction (transaction) {}
  /**
   * @param {string} query
   * @param {*} transaction
   * @abstract
   */
  async sendQuery (query, transaction = undefined) {}
  /**
   * @param {string} tableName
   * @param {Map<string, any>} attributeMap <column, value>
   * @abstract
   */
  createInsertQuery (tableName, attributeMap) {}
  /**
   * @param {string} tableName
   * @param {WhereClause} whereClause
   * @param {Join} joins
   * @abstract
   */
  createFindQuery (tableName, whereClause = undefined, joins = []) {}
  /**
   * @param {string} tableName
   * @param {Map<string, any>} attributeMap <column, value>
   * @abstract
   */
  createUpdateQuery (tableName, attributeMap) {}
  /**
   * @param {string} tableName
   * @param {WhereClause} whereClause
   * @abstract
   */
  createDeleteQuery (tableName, whereClause = undefined) {}
  /**
   * @param {string} tableName
   * @param {Map<string, any>} attributeMap <column, value>
   * @abstract
   */
  createSaveQuery (tableName, attributeMap) {}
  /**
   * @params {*} result
   * @returns {number|string}
   * @abstract
   */
  parsePrimaryKeyFromResult (result) {}
  /**
   * @params {*} result
   * @returns {number|string}
   * @abstract
   */
  parseUpdatedRowsFromResult (result) {}
  /**
   * @params {*} result
   * @returns {number|string}
   * @abstract
   */
  parseDeletedRowsFromResult (result) {}
  /**
   * @params {*} result
   * @params {string[]} attributes
   * @returns {Map<string, any>[]} <column, value>
   * @abstract
   */
  parseAttributeMapsFromResult (result, attributes) {}
  /**
   * @param {string}
   * @returns {Promise<TableShema>}
   * @abstract
   */
  async getTableShema (tableName) {}
}

module.exports = DatabaseConnection
