const Relation = require('./Relation')

class RelationManyMany extends Relation {
  /**
   * @param {string} attributeNameObject attribute where the relation object should be stored
   * @param {string} attributeNameKey attribute of foreign key
   * @param {string} referencedAttributeNameKey foreign key in referenced table
   * @param {function} referencedClass constructor of class witch extends DatabaseAccessObject
   * @param {string} relTableName table name of the relation table
   * @param {string} relKey foreign key to this class
   * @param {relReferencedKey} foreign key to the referenced table
   */
  constructor (
    attributeNameObject,
    attributeNameKey,
    referencedClass,
    referencedAttributeNameKey,
    relTableName,
    relKey,
    relReferencedKey
  ) {
    super(attributeNameObject, attributeNameKey, referencedClass, referencedAttributeNameKey)
    this.relTableName = relTableName
    this.relKey = relKey
    this.relReferencedKey = relReferencedKey
  }
}

module.exports = RelationManyMany
