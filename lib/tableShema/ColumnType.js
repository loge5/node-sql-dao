class ColumnType {
  constructor () {
    /**
     * integer, float, double, string, Date
     * @member {string}
     */
    this.type = undefined
    /**
     * @member {number}
     */
    this.min = undefined
    /**
     * @member {number}
     */
    this.max = undefined
  }
}

module.exports = ColumnType
