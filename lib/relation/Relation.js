class Relation {
  /**
   * @param {string} thisAttribute Attribute of this DAO where the relation object should be stored
   * @param {string} thisKey ForeignKey in table wich represents this DOA
   * @param {function} refClass Referenced DAO class - constructor
   * @param {string} refKey ForeignKey in the referenced table
   */
  constructor (thisAttribute, thisKey, refClass, refKey) {
    /**
     * Attribute of this DAO where the relation object should be stored
     * @member {string}
     */
    this.thisAttribute = thisAttribute
    /**
     * ForeignKey in table wich represents this DOA
     * @member {string}
     */
    this.thisKey = thisKey
    /**
     * Referenced DAO class - constructor
     * @member {function}
     */
    this.refClass = refClass
    /**
     * ForeignKey in the referenced table
     * @member {string}
     */
    this.refKey = refKey
  }
}
module.exports = Relation
