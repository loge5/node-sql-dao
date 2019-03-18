/**
 * @abstract
 */
class Relation {
  /**
   * @param {string} attributeName
   * @param {*} attributeClass
   * @param {string} foreignKey
   * @param {string} foreignTableName
   */
  constructor (attributeName, attributeClass, foreignKey, foreignTableName) {
    /**
     * @member {string}
     */
    this.attributeName = attributeName
    /**
     * Constructor of DatabaseAccessObject
     * @member {function}
     */
    this.attributeClass = attributeClass
    /**
     * @member {string}
     */
    this.foreignKey = foreignKey
    /**
     * @member {string}
     */
    this.foreignTableName = foreignTableName
  }
}

module.exports = Relation
