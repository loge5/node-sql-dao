const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Order = require('./Order')
const Customer = require('./Customer')

describe('Order', () => {
  it('should be defined', () => {
    expect(Order).to.be.a('Function')
  })
  it('find should resolve relations', async () => {
    let result = await Order.find()
    expect(result).has.length.greaterThan(0)
    expect(result[0].customer).to.be.instanceof(Customer)
  })
})
