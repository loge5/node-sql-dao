/* eslint-disable no-unused-vars */
const TableShema = require('./tableShema/TableShema')
const Column = require('./tableShema/Column')
const Relation = require('./relation/Relation')
/* eslint-enable no-unused-vars */

class Generator {
  /**
   * @param {TableShema} tableshema
   * @returns {string}
   */
  createClass (tableShema, configPath = './todo.js', databaseConnectionClass = 'MySqlDatabaseConnection') {
    let includes = new Map()
    includes.set('DatabaseAccessObject', 'DatabaseAccessObject')
    includes.set(databaseConnectionClass, databaseConnectionClass)
    let relations = [] // TODO parse relations
    let className = this.createClassName(tableShema.name)
    let member = []
    let attributeNames = []
    let validators = []
    for (let col of tableShema.columns) {
      member.push(this._createMember(col))
      attributeNames.push('\'' + col.field + '\'')
      if (col.required) {
        validators.push(`this.addValidator('${col.field}', new RequiredValidator())`)
        includes.set('RequiredValidator', 'validators.RequiredValidator')
      }
      if (col.type.type === 'string') {
        let min = '0'
        let max = 'Number.POSITIVE_INFINITY'
        if (typeof col.type.min === 'number') {
          min = col.type.min.toString()
        }
        if (typeof col.type.max === 'number') {
          max = col.type.max.toString()
        }
        validators.push(`this.addValidator('${col.field}', new LengthValidator(${min}, ${max}))`)
        includes.set('LengthValidator', 'validators.LengthValidator')
      }
      if (['integer', 'float', 'double'].indexOf(col.type.type) >= 0) {
        let min = 'Number.NEGATIVE_INFINITY'
        if (typeof col.type.min === 'number') {
          min = col.type.min
        }
        validators.push(`this.addValidator('${col.field}', new NumericValidator(${min}))`)
        includes.set('NumericValidator', 'validators.NumericValidator')
      }
    }
    return `${this._createIncludes(includes)}

const databaseConfig = require('${configPath}') // your config file

class ${className} extends DatabaseAccessObject {
${this._createConstructor(member, relations)}
${this._createValidators(validators)}
${this._createAttributes(attributeNames)}
${this._createRelations(relations)}
${this._createDatabaseMethods(databaseConnectionClass, tableShema)}
}

module.exports = ${className}
`
  }

  /**
   * @param {Map} includes
   */
  _createIncludes (includes) {
    let lines = []
    for (let k of includes.keys()) {
      lines.push(`const ${k} = require('sql-dao').${includes.get(k)}`)
    }
    return lines.join('\n')
  }

  /**
   * @param {string[]} member
   * @param {Relaation[]} relations
   */
  _createConstructor (member, relations = []) {
    // TODO handle relations
    return `  constructor () {
    super()
${member.join('\n')}
  }`
  }

  /**
   * @param {Column} Column
   */
  _createMember (Column) {
    return `    /**
     * @member {${Column.type.type}}
     */
    this.${Column.field} = undefined`
  }

  /**
   * @param {string[]} validators
   */
  _createValidators (validators) {
    return `  /**
   * set up validators
   */
  initValidators () {
    ${validators.join('\n    ')}
  }`
  }

  _createAttributes (attributeNames) {
    return `  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return [${attributeNames.join(', ')}]
  }`
  }

  /**
   * @param {Relation[]} realations
   * @returns {string}
   */
  _createRelations (realations = []) {
    // TODO implement
    return `  /**
   * @returns {Relation[]}
   */
  static getRelations () {
    return []
  }`
  }

  /**
   * @param {string} databaseConnectionClass
   * @param {TableShema} tableShema
   */
  _createDatabaseMethods (databaseConnectionClass, tableShema) {
    return `  /**
    * @returns {${databaseConnectionClass}}
    */
  static getDatabaseConnection () {
    return new ${databaseConnectionClass}(databaseConfig)
  }
  /**
   * @returns {string}
   */
  static getTableName () {
    return '${tableShema.name}'
  }
  /**
   * @returns {string}
   */
  static getPrimaryKey () {
    return ${typeof tableShema.primaryKey === 'string' ? '\'' + tableShema.primaryKey + '\'' : 'undefined'}
  }`
  }

  /**
   * @param {string} tableName
   * @returns {string}
   */
  createClassName (tableName) {
    return tableName[0].toString().toUpperCase() + tableName.substr(1)
  }
}

module.exports = Generator
