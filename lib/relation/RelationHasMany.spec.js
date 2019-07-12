const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const RelationHasMany = require('./RelationHasMany')

describe('RelationHasMany', () => {
  it('should be defined', () => {
    expect(RelationHasMany).to.be.a('Function')
  })
})
