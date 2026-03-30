const NumericValidator = require('./NumericValidator')

describe('NumericValidator', () => {
  it('should be defined', () => {
    expect(typeof NumericValidator).toBe('function')
  })
  it('validate should return errors', () => {
    const validator = new NumericValidator(1, 3, true)
    expect(validator.validate('a', { a: undefined })).toHaveLength(1)
    expect(validator.validate('a', { a: null })).toHaveLength(1)
    validator.mustBeDefined = false
    expect(validator.validate('a', { a: undefined })).toHaveLength(0)
    expect(validator.validate('a', { a: null })).toHaveLength(0)
    expect(validator.validate('a', { a: {} })).toHaveLength(1)
    expect(validator.validate('a', { a: 0 })).toHaveLength(1)
    expect(validator.validate('a', { a: 1 })).toHaveLength(0)
    expect(validator.validate('a', { a: 4 })).toHaveLength(1)
    expect(validator.validate('a', { a: 0.2 })).toHaveLength(1)
    expect(validator.validate('a', { a: 1.2 })).toHaveLength(0)
    expect(validator.validate('a', { a: 4.2 })).toHaveLength(1)
    expect(validator.validate('a', { a: '2' })).toHaveLength(0)
    expect(validator.validate('a', { a: '4' })).toHaveLength(1)
    expect(validator.validate('a', { a: 'x1' })).toHaveLength(1)
  })
})
