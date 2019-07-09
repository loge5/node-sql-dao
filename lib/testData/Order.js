const DatabaseAccessObject = require('../DatabaseAccessObject')
const RequiredValidator = require('../validators/RequiredValidator')
const NumericValidator = require('../validators/NumericValidator')
const DatabaseConnection = require('../DatabaseConnection') // eslint-disable-line
const MySqlDatabaseConnection = require('../databaseConnections/MySqlDatabaseConnection')
const Relation = require('../Relation')
const Customer = require('./Customer')
const databaseConfig = require('./db.config')

class Order extends DatabaseAccessObject {
  constructor () {
    super()
    /**
     * @member {integer}
     */
    this.id = undefined
    /**
     * @member {integer}
     */
    this.customerId = undefined
    /**
     * @member {double}
     */
    this.amount = undefined
    /**
     * Relation
     * @member {Customer}
     */
    this.customer = undefined
  }

  /**
   * set up validators
   */
  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('id', new NumericValidator(0))
    this.addValidator('customerId', new RequiredValidator())
    this.addValidator('customerId', new NumericValidator(0))
    this.addValidator('amount', new RequiredValidator())
    this.addValidator('amount', new NumericValidator(Number.NEGATIVE_INFINITY))
  }

  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return ['id', 'customerId', 'amount']
  }

  /**
   * Overwrite to addRelation's
   * @returns {Relation[]}
   */
  static getRelations () {
    return [
      new Relation(
        Relation.getTypes().HAS_ONE,
        'customer',
        'customerId',
        'id',
        Customer
      )
    ]
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
    return 'order'
  }

  /**
   * @returns {string}
   */
  static getPrimaryKey () {
    return undefined
  }
}

module.exports = Order
