const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const RelationBelongsTo = require('./RelationBelongsTo')

describe('RelationBelongsTo', () => {
  it('should be defined', () => {
    expect(RelationBelongsTo).to.be.a('Function')
  })
})
