const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Column = require('./Column')

describe('Column', () => {
  it('should be defined', () => {
    expect(Column).to.be.a('Function')
  })
})
