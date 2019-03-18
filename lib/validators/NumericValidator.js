const Validator = require('../Validator')

class NumericValidator extends Validator {
  /**
   * @param {number} min
   * @param {number} max
   * @param {boolean} mustBeDefined
   */
  constructor (min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY, mustBeDefined = false) {
    super()
    this.min = min
    this.max = max
    this.mustBeDefined = mustBeDefined
  }
  /**
   * @param {string} attribute
   * @param {Object} obj
   * @return {string[]} error messages
   */
  validate (attribute, obj) {
    let errors = []
    if (typeof obj[attribute] === 'undefined' || obj[attribute] === null) {
      if (this.mustBeDefined) {
        errors.push(attribute + ': must be set')
      }
      return
    }
    if (isNaN(obj[attribute])) {
      errors.push(attribute + ': should be numeric')
    }
    if (obj[attribute] < this.min) {
      errors.push(attribute + ': has a minimum of ' + this.min)
    }
    if (obj[attribute] > this.max) {
      errors.push(attribute + ': has a maximum of ' + this.max)
    }
    return errors
  }
}

module.exports = NumericValidator
