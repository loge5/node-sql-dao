// TODO change includes to require('dao-sql')
const DatabaseAccessObject = require('../lib/DatabaseAccessObject')
const RequiredValidator = require('../lib/validators/RequiredValidator')
const NumericValidator = require('../lib/validators/NumericValidator')
const LengthValidator = require('../lib/validators/LengthValidator')
const MySqlDatabaseConnection = require('../lib/databaseConnections/MySqlDatabaseConnection')
const databaseConfig = require('./db.config')

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
    this.addValidator('id', new NumericValidator(0))
    this.addValidator('name', new RequiredValidator())
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
