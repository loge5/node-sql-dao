const mysql = require('mysql')
const DatabaseConnection = require('../DatabaseConnection')
const TableShema = require('../tableShema/TableShema')
const Column = require('../tableShema/Column')
const ColumnType = require('../tableShema/ColumnType')
/* eslint-disable no-unused-vars */
const WhereClause = require('../WhereClause')
const Join = require('../Join')
/* eslint-enable no-unused-vars */

class MySqlDatabaseConnection extends DatabaseConnection {
  /**
   * @returns {*} transaction
   */
  async createTransaction () {
    return new Promise((resolve, reject) => {
      const connection = mysql.createConnection(this.config)
      connection.connect((err) => {
        if (err) {
          reject(err)
          return
        }
        connection.beginTransaction((err) => {
          if (err) {
            reject(err)
            return
          }
          resolve(connection)
        })
      })
    })
  }

  /**
   * @param {*} transaction
   */
  async commitTransaction (transaction) {
    return new Promise((resolve, reject) => {
      transaction.commit((e) => {
        transaction.end()
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {*} transaction
   */
  async rollbackTransaction (transaction) {
    return new Promise((resolve, reject) => {
      transaction.rollback((e) => {
        transaction.end()
        if (e) {
          reject(e)
        } else {
          resolve()
        }
      })
    })
  }

  /**
   * @param {string} query
   * @param {*} transaction
   */
  async sendQuery (query, transaction = undefined) {
    return new Promise((resolve, reject) => {
      let connection
      if (typeof transaction === 'object') {
        connection = transaction
      } else {
        connection = mysql.createConnection(this.config)
        connection.connect()
      }
      connection.query(query, (error, results, fields) => {
        if (error) {
          reject(error)
        } else {
          resolve(results)
        }
      })
      connection.end()
    })
  }

  /**
   * @param {string} tableName
   * @param {Map<string, any>} attributeMap <column, value>
   */
  createInsertQuery (tableName, attributeMap) {
    const placeHolderCols = new Array(attributeMap.size).fill('??').join(',')
    const placeHolderVals = new Array(attributeMap.size).fill('?').join(',')
    const sql = `INSERT INTO ?? (${placeHolderCols}) VALUES(${placeHolderVals})`
    let values = [tableName]
    values = values.concat(Array.from(attributeMap.keys()))
    values = values.concat(Array.from(attributeMap.values()))
    return mysql.format(sql, values)
  }

  /**
   * @param {string} tableName
   * @param {WhereClause} whereClause
   * @param {Join[]} joins
   */
  createFindQuery (tableName, whereClause = undefined, joins = []) {
    let sql = `SELECT ??.* FROM ??`
    let values = [tableName, tableName]
    for (const join of joins) {
      sql += `\n${join.type} ?? ON (${join.onClause})`
      values.push(join.tableName)
      values = values.concat(join.onValues)
    }
    if (typeof whereClause === 'object') {
      sql += `\nWHERE ${whereClause.clause}`
      values = values.concat(whereClause.values)
    }
    return mysql.format(sql, values)
  }

  /**
   * @param {string} tableName
   * @param {Map<string, any>} attributeMap <column, value>
   * @param {WhereClause} whereClause
   */
  createUpdateQuery (tableName, attributeMap, whereClause) {
    let sql = `UPDATE ?? SET ${Array(attributeMap.size).fill('?? = ?').join(',')}`
    let values = [tableName]
    for (var [attr, value] of attributeMap.entries()) {
      values.push(attr)
      values.push(value)
    }
    if (typeof whereClause === 'object') {
      sql += `\nWHERE ${whereClause.clause}`
      values = values.concat(whereClause.values)
    }
    return mysql.format(sql, values)
  }

  /**
   * @param {string} tableName
   * @param {WhereClause} whereClause
   */
  createDeleteQuery (tableName, whereClause = undefined) {
    let sql = `DELETE FROM ??`
    let values = [tableName]
    if (typeof whereClause === 'object') {
      sql += ' WHERE ' + whereClause.clause
      values = values.concat(whereClause.values)
    }
    return mysql.format(sql, values)
  }

  /**
   * @param {string} tableName
   * @param {Map<string, any>} attributeMap <column, value>
   */
  createSaveQuery (tableName, attributeMap) {
    const placeHolderCols = new Array(attributeMap.size).fill('??').join(',')
    const placeHolderVals = new Array(attributeMap.size).fill('?').join(',')
    const placeHolderUpdate = Array(attributeMap.size).fill('?? = ?').join(',')
    const sql = `INSERT INTO ?? (${placeHolderCols}) VALUES(${placeHolderVals}) ON DUPLICATE KEY UPDATE ${placeHolderUpdate}`
    let values = [tableName]
    values = values.concat(Array.from(attributeMap.keys()))
    values = values.concat(Array.from(attributeMap.values()))
    for (var [attr, value] of attributeMap.entries()) {
      values.push(attr)
      values.push(value)
    }
    return mysql.format(sql, values)
  }

  /**
   * @params {*} result
   * @returns {number|string}
   */
  parsePrimaryKeyFromResult (result) {
    if (typeof result.insertId !== 'number' || result.insertId === 0) {
      throw new Error('cant parse inserted id')
    }
    return result.insertId
  }

  /**
   * @params {*} result
   * @returns {number|string}
   */
  parseUpdatedRowsFromResult (result) {
    return result.affectedRows
  }

  /**
   * @params {*} result
   * @returns {number|string}
   */
  parseDeletedRowsFromResult (result) {
    return result.affectedRows
  }

  /**
   * @params {*} result
   * @params {string[]} attributes
   * @returns {Map<string, any>[]} <column, value>
   */
  parseAttributeMapsFromResult (result, attributes) {
    const maps = []
    for (const row of result) {
      const m = new Map()
      for (const attr of attributes) {
        m.set(attr, row[attr])
      }
      maps.push(m)
    }
    return maps
  }

  /**
   * @returns {string[]}
   */
  async getTableNames () {
    const sql = `SHOW TABLES`
    const result = await this.sendQuery(sql)
    const tableNames = []
    for (const row of result) {
      tableNames.push(row[Object.keys(row)[0]])
    }
    return tableNames
  }

  /**
   * @param {string}
   * @returns {Promise<TableShema>}
   */
  async getTableShema (tableName) {
    let sql = `SHOW COLUMNS FROM ??`
    sql = mysql.format(sql, [tableName])
    const tableShema = new TableShema()
    tableShema.name = tableName
    try {
      const result = await this.sendQuery(sql)
      for (const row of result) {
        const column = new Column()
        column.field = row.Field
        column.type = this._resolveType(row.Type)
        column.required = row.Null === 'NO' && row.Default === null && row.Extra !== 'auto_increment'
        column.isPrimaryKey = row.Key === 'PRI'
        if (column.isPrimaryKey) {
          tableShema.primaryKey = column.field
        }
        tableShema.columns.push(column)
      }
    } catch (e) {
      console.error(e)
      throw new Error('error on parsing table shema')
    }
    return tableShema
  }

  /**
   * @param {string} type
   * @returns {ColumnType}
   */
  _resolveType (type) {
    const t = new ColumnType()
    if (type.match(/date/) || type.match(/time/)) {
      t.type = 'Date'
    } else if (type.match(/int/)) {
      t.type = 'integer'
    } else if (type.match(/float/)) {
      t.type = 'float'
    } else if (type.match(/double/)) {
      t.type = 'double'
    } else if (type.match(/decimal/)) {
      t.type = 'double'
    } else {
      t.type = 'string'
      const m = type.match(/\(([0-9]+)\)/)
      if (m) {
        t.max = parseInt(m[1])
      }
    }
    if (['integer', 'float', 'double'].indexOf(t.type) >= 0) {
      if (type.match(/unsigned/)) {
        t.min = 0
      }
    }
    return t
  }
}

module.exports = MySqlDatabaseConnection
