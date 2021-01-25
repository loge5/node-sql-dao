class Join {
  /**
   * @param {string} tableName
   * @param {string} onClause
   * @param {array} onValues
   * @param {string} type
   */
  constructor (tableName, onClause, onValues = [], type = 'INNER JOIN') {
    /**
     * @member {string}
     */
    this.tableName = tableName
    /**
     * @member {string}
     */
    this.onClause = onClause
    /**
     * @member {array}
     */
    this.onValues = onValues
    /**
     * @member {string}
     */
    this.type = type
  }
}

module.exports = Join
