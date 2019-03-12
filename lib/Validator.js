class Validator {
  /**
   * @abstract
   * @param {string} attribute
   * @param {Object} obj
   * @return {string[]} error messages
   */
  validate (attribute, obj) { return [] }
}

module.exports = Validator
