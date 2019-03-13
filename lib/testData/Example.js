const DatabaseAccessObject = require('../DatabaseAccessObject')
const RequiredValidator = require('../validators/RequiredValidator')
const DatabaseConnection = require('../DatabaseConnection') // eslint-disable-line
const MySqlDatabaseConnection = require('../databaseConnections/MySqlDatabaseConnection')
const dbConfig = require('./db.config')

class Example extends DatabaseAccessObject {
  constructor () {
    super()
    /**
     * @member {number}
     */
    this.id = undefined
    /**
     * @member {string}
     */
    this.name = undefined
    /**
     * @member {date}
     */
    this.created = undefined
  }

  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('name', new RequiredValidator())
    this.addValidator('created', new RequiredValidator())
  }
  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return ['id', 'name', 'created']
  }

  /**
   * @returns {DatabaseConnection}
   */
  static getDatabaseConnection () {
    return new MySqlDatabaseConnection(dbConfig)
  }

  /**
   * @returns {string}
   */
  static getTableName () {
    return 'example'
  }

  /**
   * @returns {string}
   */
  static getPrimaryKey () {
    return 'id'
  }
}

module.exports = Example
