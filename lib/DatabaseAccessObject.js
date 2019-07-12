const Model = require('./Model')
const WhereClause = require('./WhereClause')
const Join = require('./Join')
const RelationBelongsTo = require('./relation/RelationBelongsTo')
const RelationHasOne = require('./relation/RelationHasOne')
const RelationHasMany = require('./relation/RelationHasMany')
const RelationManyMany = require('./relation/RelationManyMany')
/* eslint-disable no-unused-vars */
const DatabaseConnection = require('./DatabaseConnection')
const Relation = require('./relation/Relation')
/* eslint-enable no-unused-vars */

class DatabaseAccessObject extends Model {
  /**
   * @returns {DatabaseConnection}
   * @abstract
   */
  static getDatabaseConnection () { }
  /**
   * @abstract
   * @returns {string}
   */
  static getTableName () {}
  /**
   * @abstract
   * @returns {string}
   */
  static getPrimaryKey () {}
  /**
   * Overwrite to addRelation's
   * @returns {{Relation[]}}
   */
  static getRelations () {
    return []
  }

  /**
   * @param {*} transaction
   */
  async insert (transaction = undefined) {
    await this.beforeInsert(transaction)
    for (let relation of this.constructor.getRelations()) {
      await this._insertRefObjectBefore(relation, transaction)
    }
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createInsertQuery(this.constructor.getTableName(), this.createAttributeMap())
    let result = await connection.sendQuery(query, transaction)
    let primaryKey = this.constructor.getPrimaryKey()
    if (typeof primaryKey === 'string') {
      this[primaryKey] = connection.parsePrimaryKeyFromResult(result)
    }
    for (let relation of this.constructor.getRelations()) {
      await this._insertRefObjectAfter(relation, transaction)
    }
    await this.afterInsert(transaction)
  }

  /**
   * @param {Relation} relation
   * @param {*} transaction
   */
  async _insertRefObjectBefore (relation, transaction = undefined) {
    switch (true) {
      case relation instanceof RelationHasMany:
        // must inserted after, this is inserted
        return
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        this[relation.thisKey] = await this._insertRefObj(this[relation.thisAttribute], relation.refKey, transaction)
        return
      case relation instanceof RelationManyMany:
        return this._insertRefObjList(this[relation.thisAttribute], relation.refKey, transaction)
      default:
        throw new Error('unsupported relation type')
    }
  }

  /**
   * @param {Relation} relation
   * @param {*} transaction
   */
  async _insertRefObjectAfter (relation, transaction = undefined) {
    switch (true) {
      case relation instanceof RelationManyMany:
        return this._insertRelationEntry(relation, transaction)
      case relation instanceof RelationHasMany:
        for (let refObj of this[relation.thisAttribute]) {
          refObj[relation.refKey] = this[relation.thisKey]
          await this._insertRefObj(refObj, relation.refKey, transaction)
        }
        break
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        return
      default:
        throw new Error('unsupported relation type')
    }
  }

  /**
   * Inserts referenced object and set key to this
   * @param {DatabaseAccessObject} refObj
   * @param {string} refKey
   * @param {*} transaction
   * @returns {Promise<number|string>} new inserted id
   */
  async _insertRefObj (refObj, refKey, transaction = undefined) {
    if (typeof refObj !== 'object' || refObj === null) {
      return
    }
    if (typeof refObj[refObj.constructor.getPrimaryKey()] === 'undefined') {
      await refObj.insert(transaction)
    } else {
      await refObj.update(transaction)
    }
    if (typeof refObj[refObj.constructor.getPrimaryKey()] === 'undefined') {
      throw new Error('cant insert new DAO')
    }
    return refObj[refKey]
  }

  /**
   * @param {DatabaseAccessObject[]} refObjList
   * @param {string} refKey
   * @param {*} transaction
   */
  async _insertRefObjList (refObjList, refKey, transaction = undefined) {
    if (!Array.isArray(refObjList) || refObjList.length === 0) {
      return
    }
    for (let refObj of refObjList) {
      await this._insertRefObj(refObj, refKey, transaction)
    }
  }

  /**
   * Creates entry in relationship table
   * @param {RelationManyMany} relation
   * @param {*} transaction
   */
  async _insertRelationEntry (relation, transaction = undefined) {
    if (!Array.isArray(this[relation.thisAttribute]) || this[relation.thisAttribute].length === 0) {
      return
    }
    let connection = this.constructor.getDatabaseConnection()
    for (let refModel of this[relation.thisAttribute]) {
      let attributeMap = new Map()
      attributeMap.set(relation.relKeyThis, this[relation.thisKey])
      attributeMap.set(relation.relKeyRef, refModel[relation.refKey])
      let query = connection.createInsertQuery(relation.relTableName, attributeMap)
      await connection.sendQuery(query, transaction)
    }
  }

  /**
   * @param {WhereClause} whereClause
   * @param {Join} joins
   * @returns {DatabaseAccessObject[]}
   */
  static async find (whereClause = undefined, joins = []) {
    let connection = this.getDatabaseConnection()
    let query = connection.createFindQuery(this.getTableName(), whereClause, joins)
    let result = await connection.sendQuery(query)
    let attributeMaps = connection.parseAttributeMapsFromResult(result, this.getAttributeNames())
    let models = []
    for (let attributeMap of attributeMaps) {
      let model = new this()
      model.setAttributes(attributeMap)
      for (let relation of this.getRelations()) {
        await this._findRefObjAfter(model, relation)
      }
      models.push(model)
    }
    return models
  }

  /**
   * @param {DatabaseAccessObject} model
   * @param {Relation} relation
   */
  static async _findRefObjAfter (model, relation) {
    switch (true) {
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        let refObjList = await this._findRefObjList(model, relation)
        if (refObjList.length > 0) {
          model[relation.thisAttribute] = refObjList[0]
        }
        break
      case relation instanceof RelationHasMany:
        model[relation.thisAttribute] = await this._findRefObjList(model, relation)
        break
      case relation instanceof RelationManyMany:
        model[relation.thisAttribute] = await this._findRefObjListManyMany(model, relation)
        break
      default:
        throw new Error('unsupported relation type')
    }
  }

  /**
   * @param {DatabaseAccessObject} model
   * @param {Relation} relation
   * @param {boolean} hasOne
   */
  static async _findRefObjList (model, relation) {
    if (typeof model[relation.thisKey] === 'undefined' || model[relation.thisKey] === null) {
      return
    }
    let whereClause = new WhereClause(
      '?? = ?',
      [
        relation.refKey,
        model[relation.thisKey]
      ]
    )
    return relation.refClass.find(whereClause)
  }

  /**
   * @param {DatabaseAccessObject} model
   * @param {RelationManyMany} relation
   */
  static async _findRefObjListManyMany (model, relation) {
    let joins = []
    joins.push(new Join(
      relation.relTableName,
      '??.?? = ??.??',
      [
        relation.relTableName,
        relation.relKeyRef,
        relation.refClass.getTableName(),
        relation.refKey
      ]
    ))
    joins.push(new Join(
      this.getTableName(),
      '??.?? = ??.??',
      [
        this.getTableName(),
        relation.thisKey,
        relation.relTableName,
        relation.relKeyThis
      ]
    ))
    let whereClause = new WhereClause(
      '??.?? = ?',
      [
        this.getTableName(),
        relation.refKey,
        model[relation.thisKey]
      ]
    )
    return relation.refClass.find(whereClause, joins)
  }

  /**
   * @param {*} transaction
   * @returns {number}
   */
  async update (transaction = undefined) {
    await this.beforeUpdate(transaction)
    for (let relation of this.constructor.getRelations()) {
      await this._updateRefObjectBefore(relation, transaction)
    }
    let connection = this.constructor.getDatabaseConnection()
    let primaryKey = this.constructor.getPrimaryKey()
    let whereClause
    if (typeof primaryKey === 'string' &&
      typeof this[primaryKey] !== 'number' &&
      typeof this[primaryKey] !== 'string') {
      let attributeMap = this.createAttributeMap()
      let values = []
      for (let [attr, value] of attributeMap) {
        values.push(attr)
        values.push(value)
      }
      whereClause = new WhereClause(Array(attributeMap.size).fill('?? = ?').join(' AND '), values)
    } else {
      whereClause = new WhereClause('?? = ?', [primaryKey, this[primaryKey]])
    }
    let query = connection.createUpdateQuery(this.constructor.getTableName(), this.createAttributeMap(), whereClause)
    let result = await connection.sendQuery(query, transaction)
    let rowsAffected = connection.parseUpdatedRowsFromResult(result)
    await this.afterUpdate(transaction)
    return rowsAffected
  }

  /**
   * @param {Relation} relation
   * @param {*} transaction
   */
  async _updateRefObjectBefore (relation, transaction = undefined) {
    switch (true) {
      case relation instanceof RelationHasMany:
        await this._deleteMissingRefObjHasMany(relation, transaction)
        for (let refObj of this[relation.thisAttribute]) {
          if (typeof refObj[refObj.constructor.getPrimaryKey()] !== 'undefined') {
            await refObj.update(transaction)
          } else {
            await refObj.insert(transaction)
          }
        }
        break
      case relation instanceof RelationManyMany:
        await this._deleteMissingRelationEntries(relation, transaction)
        for (let refObj of this[relation.thisAttribute]) {
          if (typeof refObj[refObj.constructor.getPrimaryKey()] !== 'undefined') {
            await refObj.update(transaction)
          } else {
            await refObj.insert(transaction)
          }
        }
        break
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        let refObj = this[relation.thisAttribute]
        if (typeof refObj[refObj.constructor.getPrimaryKey()] !== 'undefined') {
          await refObj.update(transaction)
        } else {
          await refObj.insert(transaction)
        }
        break
      default:
        throw new Error('unsupported relation type')
    }
  }

  /**
   * @param {*} transaction
   * @returns {number}
   */
  async delete (transaction = undefined) {
    await this.beforeDelete(transaction)
    let rowsAffected = 0
    for (let relation of this.constructor.getRelations()) {
      rowsAffected += await this._deleteRefObjectBefore(relation, transaction)
    }
    let primaryKey = this.constructor.getPrimaryKey()
    let whereClause
    if (typeof primaryKey === 'string' &&
      typeof this[primaryKey] !== 'number' &&
      typeof this[primaryKey] !== 'string') {
      let attributeMap = this.createAttributeMap()
      let values = []
      for (let [attr, value] of attributeMap) {
        values.push(attr)
        values.push(value)
      }
      whereClause = new WhereClause(Array(attributeMap.size).fill('?? = ?').join(' AND '), values)
    } else {
      whereClause = new WhereClause('?? = ?', [primaryKey, this[primaryKey]])
    }
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createDeleteQuery(this.constructor.getTableName(), whereClause)
    let result = await connection.sendQuery(query, transaction)
    rowsAffected += connection.parseDeletedRowsFromResult(result)
    this[primaryKey] = undefined
    this.afterDelete(transaction)
    return rowsAffected
  }

  /**
   * @param {Relation} relation
   * @param {*} transaction
   * @returns {Promise<number>}
   */
  async _deleteRefObjectBefore (relation, transaction = undefined) {
    let rowsAffected = 0
    switch (true) {
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        // do not delete, may used elsewhere
        this[relation.thisKey] = undefined
        break
      case relation instanceof RelationHasMany:
        if (Array.isArray(this[relation.thisAttribute])) {
          for (let refObj of this[relation.thisAttribute]) {
            rowsAffected += await refObj.delete(transaction)
          }
        }
        break
      case relation instanceof RelationManyMany:
        // only delete relation entries, referenced may used elsewhere
        rowsAffected = await this._deleteRelationEntry(relation, transaction)
        break
      default:
        throw new Error('unsupported relation type')
    }
    this[relation.thisAttribute] = undefined
    return rowsAffected
  }

  /**
   * @param {RelationManyMany} relation
   * @param {*} transaction
   */
  async _deleteRelationEntry (relation, transaction = undefined) {
    if (!Array.isArray(this[relation.thisAttribute]) || this[relation.thisAttribute].length === 0) {
      return
    }
    let connection = this.constructor.getDatabaseConnection()
    let whereClause = new WhereClause('?? = ?', [relation.relKeyThis, this[relation.thisKey]])
    let query = connection.createDeleteQuery(relation.relTableName, whereClause)
    let result = await connection.sendQuery(query, transaction)
    return connection.parseDeletedRowsFromResult(result)
  }

  /**
   * @param {RelationManyMany} relation
   * @param {*} transaction
   */
  async _deleteMissingRelationEntries (relation, transaction = undefined) {
    let execptedIds = this[relation.thisAttribute].map((i) => i[relation.refKey])
    let connection = this.constructor.getDatabaseConnection()
    let whereSql = '?? = ?'
    let whereValues = [relation.relKeyThis, this[relation.thisKey]]
    if (execptedIds.length > 0) {
      whereSql += ` AND ?? NOT IN (${new Array(execptedIds.length).fill('?').join(', ')})`
      whereValues.push(relation.relKeyRef)
      whereValues = whereValues.concat(execptedIds)
    }
    let whereClause = new WhereClause(whereSql, whereValues)
    let query = connection.createDeleteQuery(relation.relTableName, whereClause)
    let result = await connection.sendQuery(query, transaction)
    return connection.parseDeletedRowsFromResult(result)
  }

  /**
   * @param {RelationHasMany} relation
   * @param {*} transaction
   */
  async _deleteMissingRefObjHasMany (relation, transaction) {
    let primaryKey = relation.refClass.getPrimaryKey()
    let execptedIds = this[relation.thisAttribute].map((i) => i[primaryKey])
    let whereSql = '?? = ?'
    let whereValues = [relation.refKey, this[relation.thisKey]]
    if (execptedIds.length > 0) {
      whereSql += ` AND ?? NOT IN (${new Array(execptedIds.length).fill('?').join(', ')})`
      whereValues.push(primaryKey)
      whereValues = whereValues.concat(execptedIds)
    }
    let connection = this.constructor.getDatabaseConnection()
    let whereClause = new WhereClause(whereSql, whereValues)
    let query = connection.createDeleteQuery(relation.refClass.getTableName(), whereClause)
    let result = await connection.sendQuery(query, transaction)
    return connection.parseDeletedRowsFromResult(result)
  }

  /**
   * Insert on duplicate update
   * @param {*} transaction
   */
  async save (transaction = undefined) {
    await this.beforeSave(transaction)
    for (let relation of this.constructor.getRelations()) {
      await this._saveRefObjectBefore(relation, transaction)
    }
    let connection = this.constructor.getDatabaseConnection()
    let query = connection.createSaveQuery(this.constructor.getTableName(), this.createAttributeMap())
    let result = await connection.sendQuery(query, transaction)
    let primaryKey = this.constructor.getPrimaryKey()
    if (typeof primaryKey === 'string' &&
      typeof this[primaryKey] !== 'number' &&
      typeof this[primaryKey] !== 'string') {
      this[primaryKey] = connection.parsePrimaryKeyFromResult(result)
    }
    for (let relation of this.constructor.getRelations()) {
      await this._saveRefObjectAfter(relation, transaction)
    }
    await this.afterSave(transaction)
  }

  /**
   * @param {Relation} relation
   * @param {*} transaction
   */
  async _saveRefObjectBefore (relation, transaction = undefined) {
    switch (true) {
      case relation instanceof RelationHasMany:
        this._deleteMissingRefObjHasMany(relation, transaction)
        // must saved after, this is saved
        return
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        this[relation.thisKey] = await this._saveRefObj(this[relation.thisAttribute], relation.refKey, transaction)
        return
      case relation instanceof RelationManyMany:
        await this._deleteMissingRelationEntries(relation, transaction)
        return this._saveRefObjList(this[relation.thisAttribute], relation.refKey, transaction)
      default:
        throw new Error('unsupported relation type')
    }
  }

  /**
   * @param {Relation} relation
   * @param {*} transaction
   */
  async _saveRefObjectAfter (relation, transaction = undefined) {
    switch (true) {
      case relation instanceof RelationManyMany:
        return this._saveRelationEntry(relation, transaction)
      case relation instanceof RelationHasMany:
        for (let refObj of this[relation.thisAttribute]) {
          refObj[relation.refKey] = this[relation.thisKey]
          await this._saveRefObj(refObj, relation.refKey, transaction)
        }
        break
      case relation instanceof RelationHasOne:
      case relation instanceof RelationBelongsTo:
        return
      default:
        throw new Error('unsupported relation type')
    }
  }

  /**
   * @param {DatabaseAccessObject} refObj
   * @param {string} refKey
   * @param {*} transaction
   * @returns {Promise<number|string>} new inserted id, or existing
   */
  async _saveRefObj (refObj, refKey, transaction = undefined) {
    if (typeof refObj !== 'object' || refObj === null) {
      return
    }
    await refObj.save(transaction)
    if (typeof refObj[refObj.constructor.getPrimaryKey()] === 'undefined') {
      throw new Error('cant insert new DAO')
    }
    return refObj[refKey]
  }

  /**
   * @param {DatabaseAccessObject[]} refObjList
   * @param {string} refKey
   * @param {*} transaction
   */
  async _saveRefObjList (refObjList, refKey, transaction = undefined) {
    if (!Array.isArray(refObjList) || refObjList.length === 0) {
      return
    }
    for (let refObj of refObjList) {
      await this._saveRefObj(refObj, refKey, transaction)
    }
  }

  /**
   * Creates entry in relationship table
   * @param {RelationManyMany} relation
   * @param {*} transaction
   */
  async _saveRelationEntry (relation, transaction = undefined) {
    if (!Array.isArray(this[relation.thisAttribute]) || this[relation.thisAttribute].length === 0) {
      return
    }
    let connection = this.constructor.getDatabaseConnection()
    for (let refModel of this[relation.thisAttribute]) {
      let attributeMap = new Map()
      attributeMap.set(relation.relKeyThis, this[relation.thisKey])
      attributeMap.set(relation.relKeyRef, refModel[relation.refKey])
      let query = connection.createSaveQuery(relation.relTableName, attributeMap)
      await connection.sendQuery(query, transaction)
    }
  }

  /**
   * @param {*} transaction
   */
  async beforeInsert (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async afterInsert (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async beforeUpdate (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async afterUpdate (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async beforeDelete (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async afterDelete (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async beforeSave (transaction = undefined) {}
  /**
   * @param {*} transaction
   */
  async afterSave (transaction = undefined) {}
}

module.exports = DatabaseAccessObject
