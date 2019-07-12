const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const RelationManyMany = require('./RelationManyMany')

describe('RelationManyMany', () => {
  it('should be defined', () => {
    expect(RelationManyMany).to.be.a('Function')
  })
})
