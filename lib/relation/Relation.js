class Relation {
  /**
   * @param {string} attributeNameObject attribute where the relation object should be stored
   * @param {string} attributeNameKey attribute of foreign key
   * @param {string} referencedAttributeNameKey foreign key in referenced table
   * @param {function} referencedClass constructor of class witch extends DatabaseAccessObject
   */
  constructor (attributeNameObject, attributeNameKey, referencedClass, referencedAttributeNameKey) {
    /**
     * @member {string}
     */
    this.attributeNameObject = attributeNameObject
    /**
     * @member {string}
     */
    this.attributeNameKey = attributeNameKey
    /**
     * @member {function}
     */
    this.referencedClass = referencedClass
    /**
     * @member {string}
     */
    this.referencedAttributeNameKey = referencedAttributeNameKey
  }
}
module.exports = Relation
