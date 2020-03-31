const DatabaseAccessObject = require('sql-dao').DatabaseAccessObject
const MySqlDatabaseConnection = require('sql-dao').MySqlDatabaseConnection
const RequiredValidator = require('sql-dao').validators.RequiredValidator
const NumericValidator = require('sql-dao').validators.NumericValidator
const LengthValidator = require('sql-dao').validators.LengthValidator

const databaseConfig = require('example/db.config.js') // your config file

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
