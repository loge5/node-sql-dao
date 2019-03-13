const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const TableColumnType = require('./TableColumnType')

describe('TableColumnType', () => {
  it('should be defined', () => {
    expect(TableColumnType).to.be.a('Function')
  })
})
