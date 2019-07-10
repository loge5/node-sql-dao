const DatabaseAccessObject = require('../DatabaseAccessObject')
const RequiredValidator = require('../validators/RequiredValidator')
const NumericValidator = require('../validators/NumericValidator')
const LengthValidator = require('../validators/LengthValidator')
const DatabaseConnection = require('../DatabaseConnection') // eslint-disable-line
const MySqlDatabaseConnection = require('../databaseConnections/MySqlDatabaseConnection')
const databaseConfig = require('./db.config.js')

class Item extends DatabaseAccessObject {
  constructor () {
    super()
    /**
     * @member {integer}
     */
    this.id = undefined
    /**
     * @member {string}
     */
    this.description = undefined
  }

  /**
   * set up validators
   */
  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('id', new NumericValidator(0))
    this.addValidator('description', new LengthValidator(0, 100))
  }

  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return ['id', 'description']
  }

  /**
   * @returns {DatabaseConnection}
   */
  static getDatabaseConnection () {
    return new MySqlDatabaseConnection(databaseConfig)
  }

  /**
   * @returns {string}
   */
  static getTableName () {
    return 'item'
  }

  /**
   * @returns {string}
   */
  static getPrimaryKey () {
    return undefined
  }
}

module.exports = Item
