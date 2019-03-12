const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Model = require('./Model')

describe('Model', () => {
  it('should be defined', () => {
    expect(Model).to.be.a('Function')
  })
})
