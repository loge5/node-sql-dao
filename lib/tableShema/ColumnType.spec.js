const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const ColumnType = require('./ColumnType')

describe('ColumnType', () => {
  it('should be defined', () => {
    expect(ColumnType).to.be.a('Function')
  })
})
