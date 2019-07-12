const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Join = require('./Join')

describe('Join', () => {
  it('should be defined', () => {
    expect(Join).to.be.a('Function')
  })
})
