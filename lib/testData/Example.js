const DatabaseAccessObject = require('../DatabaseAccessObject')
const RequiredValidator = require('../validators/RequiredValidator')
const NumericValidator = require('../validators/NumericValidator')
const LengthValidator = require('../validators/LengthValidator')
const DatabaseConnection = require('../DatabaseConnection') // eslint-disable-line
const MySqlDatabaseConnection = require('../databaseConnections/MySqlDatabaseConnection')
const dbConfig = require('./db.config')

class Example extends DatabaseAccessObject {
  constructor () {
    super()
    /**
     * @member {integer}
     */
    this.id = undefined
    /**
     * @member {string}
     */
    this.name = undefined
    /**
     * @member {Date}
     */
    this.created = undefined
  }

  /**
   * set up validators
   */
  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('id', new NumericValidator(0))
    this.addValidator('name', new LengthValidator(0, 100))
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
