const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const LengthValidator = require('./LengthValidator')

describe('LengthValidator', () => {
  it('should be defined', () => {
    expect(LengthValidator).to.be.a('Function')
  })
  it('validate should return errors', () => {
    let validator = new LengthValidator(1, 3)
    expect(validator.validate('a', { a: '' })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: 'x' })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 'xxx' })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: 'xxxx' })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: [] })).to.have.lengthOf(1)
    expect(validator.validate('a', { a: [1] })).to.have.lengthOf(0)
    expect(validator.validate('a', { a: [1, 2, 3, 4] })).to.have.lengthOf(1)
  })
})
