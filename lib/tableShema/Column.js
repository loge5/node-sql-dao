const ColumnType = require('./ColumnType') // eslint-disable-line no-unused-vars

class Column {
  constructor () {
    /**
     * @member {string}
     */
    this.field = undefined
    /**
     * @member {ColumnType}
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

module.exports = Column
