const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Order = require('./Order')
const Customer = require('./Customer')
const Shop = require('./Shop')

describe('Order', () => {
  it('should be defined', () => {
    expect(Order).to.be.a('Function')
  })
  it('find should resolve relations', async () => {
    let result = await Order.find()
    expect(result).has.length.greaterThan(0)
    expect(result[0].shop.name).equals('Test Shop')
    expect(result[0].customer).to.be.instanceof(Customer)
    expect(result[0].items).has.length.greaterThan(0)
    expect(result[0].items[0].description).equals('Mate')
  })
  it('insert should also insert relations', async () => {
    let shop = new Shop()
    shop.name = 'Test 2 Shop'
    let customer = new Customer()
    customer.name = 'Testeroni'
    let order = new Order()
    order.amount = 11
    order.shop = shop
    order.customer = customer
    order.validate()
    await order.insert()
    expect(order.id).to.be.a('number')
    expect(order.shop.id).to.be.a('number')
    expect(order.customer.id).to.be.a('number')
  })
})
