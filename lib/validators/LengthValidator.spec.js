const LengthValidator = require('./LengthValidator')

describe('LengthValidator', () => {
  it('should be defined', () => {
    expect(typeof LengthValidator).toBe('function')
  })
  it('validate should return errors', () => {
    const validator = new LengthValidator(1, 3, true)
    expect(validator.validate('a', { a: undefined })).toHaveLength(1)
    expect(validator.validate('a', { a: null })).toHaveLength(1)
    validator.mustBeDefined = false
    expect(validator.validate('a', { a: undefined })).toHaveLength(0)
    expect(validator.validate('a', { a: null })).toHaveLength(0)
    expect(validator.validate('a', { a: '' })).toHaveLength(1)
    expect(validator.validate('a', { a: 'x' })).toHaveLength(0)
    expect(validator.validate('a', { a: 'xxx' })).toHaveLength(0)
    expect(validator.validate('a', { a: 'xxxx' })).toHaveLength(1)
    expect(validator.validate('a', { a: [] })).toHaveLength(1)
    expect(validator.validate('a', { a: [1] })).toHaveLength(0)
    expect(validator.validate('a', { a: [1, 2, 3, 4] })).toHaveLength(1)
  })
})
