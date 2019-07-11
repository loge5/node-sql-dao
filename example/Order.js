const DatabaseAccessObject = require('../lib/DatabaseAccessObject')
const RequiredValidator = require('../lib/validators/RequiredValidator')
const NumericValidator = require('../lib/validators/NumericValidator')
const DatabaseConnection = require('../lib/DatabaseConnection') // eslint-disable-line
const MySqlDatabaseConnection = require('../lib/databaseConnections/MySqlDatabaseConnection')
const RelationBelongsTo = require('../lib/relation/RelationBelongsTo')
const RelationHasOne = require('../lib/relation/RelationHasOne')
const RelationHasMany = require('../lib/relation/RelationHasMany')
const RelationManyMany = require('../lib/relation/RelationManyMany')
const Customer = require('./Customer')
const Item = require('./Item')
const Remark = require('./Remark')
const Shop = require('./Shop')
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
    this.shopId = undefined
    /**
     * @member {integer}
     */
    this.customerId = undefined
    /**
     * @member {double}
     */
    this.amount = undefined
    /**
     * @member {Shop}
     */
    this.shop = undefined
    /**
     * @member {Customer}
     */
    this.customer = undefined
    /**
     * @member {Item[]}
     */
    this.items = undefined
  }

  /**
   * set up validators
   */
  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('id', new NumericValidator(0))
    this.addValidator('customerId', new NumericValidator(0))
    this.addValidator('amount', new RequiredValidator())
    this.addValidator('amount', new NumericValidator(Number.NEGATIVE_INFINITY))
    this.addValidator('shop', new RequiredValidator())
    this.addValidator('customer', new RequiredValidator())
  }

  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return ['id', 'shopId', 'customerId', 'amount']
  }

  /**
   * Overwrite to addRelation's
   * @returns {Relation[]}
   */
  static getRelations () {
    return [
      new RelationBelongsTo('shop', 'shopId', Shop, 'id'),
      new RelationHasOne('customer', 'customerId', Customer, 'id'),
      new RelationHasMany('remarks', 'id', Remark, 'orderId'),
      new RelationManyMany('items', 'id', Item, 'id', 'item_order', 'orderId', 'itemId')
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
    return 'id'
  }
}

module.exports = Order
