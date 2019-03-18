const Column = require('./Column') // eslint-disable-line no-unused-vars

class TableShema {
  constructor () {
    /**
     * @member {string}
     */
    this.name = []
    /**
     * @member {Column[]}
     */
    this.columns = []
    /**
     * @member {string}
     */
    this.primaryKey = undefined
  }
}

module.exports = TableShema
