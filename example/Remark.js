const DatabaseAccessObject = require('../lib/DatabaseAccessObject')
const RequiredValidator = require('../lib/validators/RequiredValidator')
const NumericValidator = require('../lib/validators/NumericValidator')
const LengthValidator = require('../lib/validators/LengthValidator')
const DatabaseConnection = require('../lib/DatabaseConnection') // eslint-disable-line
const MySqlDatabaseConnection = require('../lib/databaseConnections/MySqlDatabaseConnection')
const databaseConfig = require('./db.config.js')

class Remark extends DatabaseAccessObject {
  constructor () {
    super()
    /**
     * @member {integer}
     */
    this.id = undefined
    /**
     * @member {integer}
     */
    this.orderId = undefined
    /**
     * @member {string}
     */
    this.text = undefined
  }

  /**
   * set up validators
   */
  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('id', new NumericValidator(0))
    this.addValidator('orderId', new RequiredValidator())
    this.addValidator('orderId', new NumericValidator(0))
    this.addValidator('text', new RequiredValidator())
    this.addValidator('text', new LengthValidator(0, 100))
  }

  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return ['id', 'orderId', 'text']
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
    return 'remark'
  }

  /**
   * @returns {string}
   */
  static getPrimaryKey () {
    return 'id'
  }
}

module.exports = Remark
