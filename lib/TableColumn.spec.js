const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const TableColumn = require('./TableColumn')

describe('TableColumn', () => {
  it('should be defined', () => {
    expect(TableColumn).to.be.a('Function')
  })
})
