class Relation {
  /**
   * @param {string} attributeNameKey
   * @param {string} attributeNameObject
   * @param {function} referencedClass class witch extends DatabaseAccessObject
   * @param {number} type
   */
  constructor (type, attributeNameObject, attributeNameKey, referencedAttributeNameKey, referencedClass) {
    /**
     * @member {number}
     */
    this.type = type
    /**
     * @member {string}
     */
    this.attributeNameObject = attributeNameObject
    /**
     * @member {string}
     */
    this.attributeNameKey = attributeNameKey
    /**
     * @member {string}
     */
    this.referencedAttributeNameKey = referencedAttributeNameKey
    /**
     * class witch extends DatabaseAccessObject
     * @member {function}
     */
    this.referencedClass = referencedClass
  }
  /**
   * @returns {{BELONGS_TO: number, HAS_MANY: number, HAS_ONE: number, MANY_MANY: number}}
   */
  static getTypes () {
    return {
      HAS_MANY: 0,
      HAS_ONE: 1,
      MANY_MANY: 2
    }
  }
}
module.exports = Relation
