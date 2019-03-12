const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Validator = require('./Validator')

describe('Validator', () => {
  it('should be defined', () => {
    expect(Validator).to.be.a('Function')
  })
})
