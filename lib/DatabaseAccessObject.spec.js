const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const DatabaseAccessObject = require('./DatabaseAccessObject')

describe('DatabaseAccessObject', () => {
  it('should be defined', () => {
    expect(DatabaseAccessObject).to.be.a('Function')
  })
})
