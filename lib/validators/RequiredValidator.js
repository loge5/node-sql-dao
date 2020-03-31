const Validator = require('../Validator')

class RequiredValidator extends Validator {
  /**
   * @param {boolean} isEmptyAllowed
   */
  constructor (isEmptyAllowed = false) {
    super()
    this.isEmptyAllowed = isEmptyAllowed
  }

  /**
   * @param {string} attribute
   * @param {Object} obj
   * @return {string[]} error messages
   */
  validate (attribute, obj) {
    const errors = []
    if (typeof obj[attribute] === 'undefined' || obj[attribute] === null) {
      errors.push(attribute + ': is mandatory')
    } else if (!this.isEmptyAllowed &&
      (typeof obj[attribute] === 'string' || Array.isArray(obj[attribute])) &&
      obj[attribute].length < 1) {
      errors.push(attribute + ': should not be empty')
    }
    return errors
  }
}

module.exports = RequiredValidator
