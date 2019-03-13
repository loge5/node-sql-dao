const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Generator = require('./Generator')

describe('Generator', () => {
  it('should be defined', () => {
    expect(Generator).to.be.a('Function')
  })
})
