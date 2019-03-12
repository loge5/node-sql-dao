const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const DatabaseConnection = require('./DatabaseConnection')

describe('DatabaseConnection', () => {
  it('should be defined', () => {
    expect(DatabaseConnection).to.be.a('Function')
  })
})
