const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Relation = require('./Relation')

describe('Relation', () => {
  it('should be defined', () => {
    expect(Relation).to.be.a('Function')
  })
})
