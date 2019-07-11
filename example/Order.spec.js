const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const WhereClause = require('../lib/WhereClause')
const Order = require('./Order')
const Customer = require('./Customer')
const Shop = require('./Shop')
const Item = require('./Item')
const Remark = require('./Remark')

let shopTest
let orderTest
let itemTestExisting
let itemTestNew
let customerTestNew
let remarkTest

describe('Order', () => {
  it('should be defined', () => {
    expect(Order).to.be.a('Function')
  })
  it('insert references (Shop&Item) should set id', async () => {
    shopTest = new Shop()
    shopTest.name = 'Test Shop'
    await shopTest.insert()
    expect(shopTest.id).to.be.a('number')
    itemTestExisting = new Item()
    itemTestExisting.description = 'Mate'
    await itemTestExisting.insert()
    expect(itemTestExisting.id).to.be.a('number')
  })
  it('find references (Shop&Item) should find shop with same id', async () => {
    let shops = await Shop.find(new WhereClause('id = ?', [shopTest.id]))
    expect(shops[0]).to.be.instanceof(Shop)
    expect(shops[0].id).to.equals(shopTest.id)
    let items = await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))
    expect(items[0]).to.be.instanceof(Item)
    expect(items[0].id).to.equals(itemTestExisting.id)
  })
  it('insert order should also insert relations', async () => {
    customerTestNew = new Customer()
    customerTestNew.name = 'Testeroni'
    itemTestNew = new Item()
    itemTestNew.description = 'Pizza'
    remarkTest = new Remark()
    remarkTest.text = 'Extra cheeese'
    orderTest = new Order()
    orderTest.amount = 11
    orderTest.shop = shopTest
    orderTest.customer = customerTestNew
    orderTest.remarks = [remarkTest]
    orderTest.items = [itemTestExisting, itemTestNew]
    orderTest.validate()
    await orderTest.insert()
    expect(orderTest.id).to.be.a('number')
    expect(orderTest.shop.id).to.be.a('number')
    expect(orderTest.customer.id).to.be.a('number')
    expect(orderTest.remarks[0].id).to.be.a('number')
    expect(orderTest.items).has.lengthOf(2)
  })
  it('find order should find inserted order with relations', async () => {
    let result = await Order.find(new WhereClause('id = ?', [orderTest.id]))
    expect(result).has.length.greaterThan(0)
    expect(result[0].shop.name).equals(shopTest.name)
    expect(result[0].customer).to.be.instanceof(Customer)
    expect(result[0].items).has.lengthOf(2)
    expect(result[0].items[0].description).equals('Mate')
    expect(result[0].remarks).has.lengthOf(1)
    expect(result[0].remarks[0].text).equals('Extra cheeese')
  })
  it('delete order should only delete hasMany relations', async () => {
    let affectedRows = await orderTest.delete()
    expect(affectedRows).to.be.a('number')
    expect(affectedRows).to.be.greaterThan(0)
    expect(await Shop.find(new WhereClause('id = ?', [shopTest.id]))).has.lengthOf(1)
    expect(await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))).has.lengthOf(1)
    expect(await Item.find(new WhereClause('id = ?', [itemTestNew.id]))).has.lengthOf(1)
    expect(await Customer.find(new WhereClause('id = ?', [customerTestNew.id]))).has.lengthOf(1)
    expect(await Remark.find(new WhereClause('id = ?', [remarkTest.id]))).has.lengthOf(0)
  })
  it('delete references (Shop&Item&Customer) should unset id', async () => {
    expect(await shopTest.delete(), 'effectedRows').equals(1)
    expect(shopTest.id).to.be.a('undefined')
    expect(await itemTestExisting.delete(), 'effectedRows').equals(1)
    expect(itemTestExisting.id).to.be.a('undefined')
    expect(await itemTestNew.delete(), 'effectedRows').equals(1)
    expect(itemTestNew.id).to.be.a('undefined')
    expect(await customerTestNew.delete(), 'effectedRows').equals(1)
    expect(customerTestNew.id).to.be.a('undefined')
  })
  it('after delete references (Shop&Item&Customer), nothing should be found', async () => {
    expect(await Shop.find(new WhereClause('id = ?', [shopTest.id]))).has.lengthOf(0)
    expect(await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))).has.lengthOf(0)
    expect(await Item.find(new WhereClause('id = ?', [itemTestNew.id]))).has.lengthOf(0)
    expect(await Customer.find(new WhereClause('id = ?', [customerTestNew.id]))).has.lengthOf(0)
  })
})
