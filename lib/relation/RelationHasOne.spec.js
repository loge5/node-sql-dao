const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const RelationHasOne = require('./RelationHasOne')

describe('RelationHasOne', () => {
  it('should be defined', () => {
    expect(RelationHasOne).to.be.a('Function')
  })
})
