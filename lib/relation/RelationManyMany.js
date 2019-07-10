const Relation = require('./Relation')

class RelationManyMany extends Relation {
  /**
   * Table shema: (this) <- (rel) -> (ref)
   * "this" means the object in wich the relation is defined
   *
   * @param {string} thisAttribute Attribute of this DAO where the relation object should be stored
   * @param {string} thisKey ForeignKey in table wich represents this DOA
   * @param {function} refClass Referenced DAO class - constructor
   * @param {string} refKey ForeignKey in the referenced table
   * @param {string} relTableName name of relation table
   * @param {string} relKeyThis ForeignKey in relation table, wich points to this DAO
   * @param {string} relKeyRef ForeignKey in relation table, wich points to the referenced table
   */
  constructor (thisAttribute, thisKey, refClass, refKey, relTableName, relKeyThis, relKeyRef) {
    super(thisAttribute, thisKey, refClass, refKey)
    /**
     * name of relation table
     * @member {string}
     */
    this.relTableName = relTableName
    /**
     * ForeignKey in relation table, wich points to this DAO
     * @member {string}
     */
    this.relKeyThis = relKeyThis
    /**
     * ForeignKey in relation table, wich points to the referenced table
     * @member {string}
     */
    this.relKeyRef = relKeyRef
  }
}

module.exports = RelationManyMany
