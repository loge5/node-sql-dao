const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const NumericValidator = require('./NumericValidator')

describe('NumericValidator', () => {
  it('should be defined', () => {
    expect(NumericValidator).to.be.a('Function')
  })
  it('validate should return errors', () => {
    const validator = new NumericValidator(1, 3, true)
    expect(validator.validate('a', { a: undefined })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: null })).to.have.lengthOf(1)
    validator.mustBeDefined = false
    expect(validator.validate('a', { a: undefined })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: null })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: {} })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 0 })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 1 })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 4 })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 0.2 })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 1.2 })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 4.2 })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: '2' })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: '4' })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 'x1' })).to.have.lengthOf(1)
  })
})
