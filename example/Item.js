const DatabaseAccessObject = require('../lib/DatabaseAccessObject')
const NumericValidator = require('../lib/validators/NumericValidator')
const LengthValidator = require('../lib/validators/LengthValidator')
const MySqlDatabaseConnection = require('../lib/databaseConnections/MySqlDatabaseConnection')
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
   * @returns {Relation[]}
   */
  static getRelations () {
    return []
  }

  /**
   * @returns {MySqlDatabaseConnection}
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
    return 'id'
  }
}

module.exports = Item
