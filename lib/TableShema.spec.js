const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const TableShema = require('./TableShema')

describe('TableShema', () => {
  it('should be defined', () => {
    expect(TableShema).to.be.a('Function')
  })
})
