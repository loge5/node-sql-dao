const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const WhereClause = require('./WhereClause')

describe('WhereClause', () => {
  it('should be defined', () => {
    expect(WhereClause).to.be.a('Function')
  })
})
