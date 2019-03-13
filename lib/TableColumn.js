const TableColumnType = require('./TableColumnType')

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
