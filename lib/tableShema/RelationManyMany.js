const Relation = require('./Relation')

/**
 * For Many to Many Relationships
 */
class RelationManyMany extends Relation {
  /**
   * Arguments Example:
   * own table (tableName defined in parent object) has attribute "foreignKeySelf"
   * target table "tableNameTarget" has attribute "foreignKeyTarget"
   * relation table "tableNameRelation" has 2 attributes "foreignKeyReleationSelf" and "foreignKeyRelationTarget"
   *
   * @param {string} attributeName
   * @param {*} attributeClass
   * @param {string} foreignKeySelf key of the own table
   * @param {string} tableNameRelation relation table
   * @param {string} foreignKeyReleationSelf key in relation table witch points to the own table
   * @param {string} foreignKeyRelationTarget key in relation table witch points to the target table
   * @param {string} foreignKeyTarget key in the target table
   * @param {string} tableNameTarget target table
   */
  constructor (
    attributeName,
    attributeClass,
    foreignKeySelf,
    tableNameRelation,
    foreignKeyReleationSelf,
    foreignKeyRelationTarget,
    foreignKeyTarget,
    tableNameTarget
  ) {
    super(attributeName, attributeClass, foreignKeySelf, tableNameRelation)
    this.foreignKeySelf = foreignKeySelf
    this.tableNameRelation = tableNameRelation
    this.foreignKeyReleationSelf = foreignKeyReleationSelf
    this.foreignKeyRelationTarget = foreignKeyRelationTarget
    this.foreignKeyTarget = foreignKeyTarget
    this.tableNameTarget = tableNameTarget
  }
}
module.exports = RelationManyMany
