const Validator = require('./Validator') // eslint-disable-line

/**
 * Model with validation
 * @abstract
 */
class Model {
  constructor () {
    /**
     * @member {{attribute: string, validator: Validator}[]}
     */
    this._validators = []
    /**
     * List on error messages
     * for displaying in forms e.g.
     * @member {string[]}
     */
    this.errors = []
    this.initValidators()
  }

  /**
   * Overwrite to addValidator's
   * @abstract
   */
  initValidators () {}

  /**
   * Attributes with should be validated (or stored in db)
   * @abstract
   * @returns {string[]}
   */
  static getAttributeNames () { return [] }

  /**
   * Add an validator
   * @param {string} attribute
   * @param {validator} validator
   * @returns {string[]}
   */
  addValidator (attribute, validator) {
    this._validators.push({ attribute: attribute, validator: validator })
  }

  /**
   * Will add error messages to this.error
   * @returns {boolean}
   */
  validate () {
    this.errors = []
    for (var { attribute, validator } of this._validators) {
      this.errors = this.errors.concat(validator.validate(attribute, this))
    }
    return this.errors.length === 0
  }

  /**
   * @returns {Map<string, any>} <column, value>
   */
  createAttributeMap () {
    const map = new Map()
    for (const attr of this.constructor.getAttributeNames()) {
      if (typeof this[attr] !== 'undefined') {
        map.set(attr, this[attr])
      }
    }
    return map
  }

  /**
   * @param {Map<string, any>[]} <column, value>
   */
  setAttributes (attributeMap) {
    const attributes = this.constructor.getAttributeNames()
    for (const attr of attributes) {
      this[attr] = attributeMap.get(attr)
    }
  }
}

module.exports = Model
