const Validator = require('../Validator')

class LengthValidator extends Validator {
  /**
   * @param {number} minLength
   * @param {number} maxLength
   * @param {boolean} mustBeDefined
   */
  constructor (minLength = 0, maxLength = Number.POSITIVE_INFINITY, mustBeDefined = false) {
    super()
    this.minLength = minLength
    this.maxLength = maxLength
    this.mustBeDefined = mustBeDefined
  }

  /**
   * @param {string} attribute
   * @param {Object} obj
   * @return {string[]} error messages
   */
  validate (attribute, obj) {
    const errors = []
    if (typeof obj[attribute] === 'undefined' || obj[attribute] === null) {
      if (this.mustBeDefined) {
        errors.push(attribute + ': must be set')
      }
      return
    }
    if (typeof obj[attribute].length !== 'number') {
      throw new Error('attribute has no length')
    }
    if (obj[attribute].length < this.minLength) {
      errors.push(attribute + ': has a minimum length of ' + this.minLength)
    }
    if (obj[attribute].length > this.maxLength) {
      errors.push(attribute + ': has a maximum length of ' + this.maxLength)
    }
    return errors
  }
}

module.exports = LengthValidator
