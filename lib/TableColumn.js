const TableColumnType = require('./TableColumnType') // eslint-disable-line no-unused-vars

class TableColumn {
  constructor () {
    /**
     * @member {string}
     */
    this.field = undefined
    /**
     * @member {TableColumnType}
     */
    this.type = undefined
    /**
     * @member {boolean}
     */
    this.required = undefined
    /**
     * @member {boolean}
     */
    this.isPrimaryKey = undefined
  }
}

module.exports = TableColumn
