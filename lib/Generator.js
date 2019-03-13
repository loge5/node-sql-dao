const TableShema = require('./TableShema') // eslint-disable-line
const TableColumn = require('./TableColumn') // eslint-disable-line

class Generator {
  /**
   * @param {TableShema} tableshema
   * @returns {string}
   */
  createClass (tableShema, configPath = './todo.js', databaseConnectionClass = 'MySqlDatabaseConnection') {
    let className = this.createClassName(tableShema.name)
    let member = []
    let attributeNames = []
    let validators = []
    for (let col of tableShema.columns) {
      member.push(this._createMember(col))
      attributeNames.push('\'' + col.field + '\'')
      if (col.required) {
        validators.push(`this.addValidator(${col.field}, new RequiredValidator())`)
      }
      // TOOD add more validators
    }
    return `const DatabaseAccessObject = require('sql-dao').DatabaseAccessObject
const RequiredValidator = require('sql-dao').validators.RequiredValidator
const DatabaseConnection = require('sql-dao').DatabaseConnection
const ${databaseConnectionClass} = require('sql-dao').${databaseConnectionClass}
const databaseConfig = require('${configPath}')

class ${className} extends DatabaseAccessObject {
  constructor () {
    super()
${member.join("")}  }

  /**
   * set up validators
   */
  initValidators () {
    this.addValidator('id', new RequiredValidator())
    this.addValidator('name', new RequiredValidator())
    this.addValidator('created', new RequiredValidator())
  }

  /**
   * Attributes with should be validated (or stored in db)
   * @returns {string[]}
   */
  static getAttributeNames () {
    return [${attributeNames.join(', ')}]
  }

  /**
   * @returns {DatabaseConnection}
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
  }
}

module.exports = ${className}
`
  }
  /**
   * @param {TableColumn} tableColumn 
   */
  _createMember (tableColumn) {
    return `    /**
     * @member {${tableColumn.type.type}}
     */
    this.${tableColumn.field} = undefined
`
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
