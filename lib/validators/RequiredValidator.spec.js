const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const RequiredValidator = require('./RequiredValidator')

describe('RequiredValidator', () => {
  it('should be defined', () => {
    expect(RequiredValidator).to.be.a('Function')
  })
  it('validate (empty not allowed) should return errors on missing attributes', () => {
    const validator = new RequiredValidator()
    expect(validator.validate('a', {})).to.have.lengthOf(1)
    expect(validator.validate('a', { a: undefined })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: null })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: '' })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 't' })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 0 })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 1 })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: true })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: false })).to.have.lengthOf(0)
  })
  it('validate (empty allowed) should return errors on missing attributes', () => {
    const validator = new RequiredValidator(true)
    expect(validator.validate('a', {})).to.have.lengthOf(1)
    expect(validator.validate('a', { a: undefined })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: null })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: '' })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 't' })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 0 })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 1 })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: true })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: false })).to.have.lengthOf(0)
  })
})
