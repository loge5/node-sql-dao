class WhereClause {
  /**
   * Example:
   *   clause = 'a = ? AND (b = ? OR c = ?)'
   *   values = [1,2,3]
   *   -> 'a = 1 AND (b = 2 OR c = 3)'
   * @param {string} sqlString
   * @param {any[]} values
   */
  constructor (sqlString, values) {
    this.clause = sqlString
    this.values = values
  }
}

module.exports = WhereClause
