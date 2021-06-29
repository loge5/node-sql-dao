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
let itemTestNew2
let customerTestNew
let customerTestNew2
let remarkTest1
let remarkTest2
let remarkNew

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
    const shops = await Shop.find(new WhereClause('id = ?', [shopTest.id]))
    expect(shops[0]).to.be.instanceof(Shop)
    expect(shops[0].id).to.equals(shopTest.id)
    const items = await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))
    expect(items[0]).to.be.instanceof(Item)
    expect(items[0].id).to.equals(itemTestExisting.id)
  })
  it('insert order should also insert relations', async () => {
    customerTestNew = new Customer()
    customerTestNew.name = 'Testeroni'
    itemTestNew = new Item()
    itemTestNew.description = 'Pizza'
    remarkTest1 = new Remark()
    remarkTest1.text = 'Extra cheeese'
    remarkTest2 = new Remark()
    remarkTest2.text = 'olives please'
    orderTest = new Order()
    orderTest.amount = 11
    orderTest.shop = shopTest
    orderTest.customer = customerTestNew
    orderTest.remarks = [remarkTest1, remarkTest2]
    orderTest.items = [itemTestExisting, itemTestNew]
    orderTest.validate()
    await orderTest.insert()
    expect(orderTest.id).to.be.a('number')
    expect(orderTest.shop.id).to.be.a('number')
    expect(orderTest.customer.id).to.be.a('number')
    expect(orderTest.remarks[0].id).to.be.a('number')
    expect(orderTest.remarks[1].id).to.be.a('number')
    expect(orderTest.items).has.lengthOf(2)
  })
  it('find order should find inserted order with relations', async () => {
    const result = await Order.find(new WhereClause('id = ?', [orderTest.id]))
    expect(result).has.length.greaterThan(0)
    expect(result[0].shop.name).equals(shopTest.name)
    expect(result[0].customer).to.be.instanceof(Customer)
    expect(result[0].items).has.lengthOf(2)
    expect(result[0].items[0].description).equals('Mate')
    expect(result[0].remarks).has.lengthOf(2)
    expect(result[0].remarks[0].text).equals('Extra cheeese')
    expect(result[0].remarks[1].text).equals('olives please')
  })
  it('update order should also update/remove relations', async () => {
    orderTest.amount = 12
    orderTest.customer.name = 'Testi'
    orderTest.remarks[0].text = 'Extra Extra cheeese'
    orderTest.remarks = [orderTest.remarks[0]]
    orderTest.items[0].description = 'Mate!'
    orderTest.items = [orderTest.items[0]]
    orderTest.shop.name = 'Test Shop2'
    await orderTest.update()
    const result = await Order.find(new WhereClause('id = ?', [orderTest.id]))
    expect(result).has.length.greaterThan(0)
    const orderCheck = result[0]
    expect(orderCheck.amount).equals(12)
    expect(orderTest.customer.name).equals('Testi')
    expect(orderTest.remarks[0].text).equals('Extra Extra cheeese')
    expect(result[0].remarks).has.lengthOf(1)
    expect(await Remark.find(new WhereClause('id = ?', [remarkTest2.id]))).has.lengthOf(0)
    expect(orderTest.items).has.lengthOf(1)
    expect(orderTest.items[0].description).equals('Mate!')
    expect(orderTest.shop.name).equals('Test Shop2')
  })
  it('delete order should only delete hasMany relations', async () => {
    const affectedRows = await orderTest.delete()
    expect(affectedRows).to.be.a('number')
    expect(affectedRows).to.be.greaterThan(0)
    expect(await Shop.find(new WhereClause('id = ?', [shopTest.id]))).has.lengthOf(1)
    expect(await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))).has.lengthOf(1)
    expect(await Item.find(new WhereClause('id = ?', [itemTestNew.id]))).has.lengthOf(1)
    expect(await Customer.find(new WhereClause('id = ?', [customerTestNew.id]))).has.lengthOf(1)
    expect(await Remark.find(new WhereClause('id = ?', [remarkTest1.id]))).has.lengthOf(0)
  })
  it('save order should also insert also relations', async () => {
    remarkNew = new Remark()
    remarkNew.text = 'test'
    customerTestNew2 = new Customer()
    customerTestNew2.name = 'Testi Mc Testface'
    itemTestNew2 = new Item()
    itemTestNew2.description = 'Test test test'
    const order = new Order()
    order.amount = 1337
    order.shop = shopTest
    order.customer = customerTestNew2
    order.remarks = [remarkNew]
    order.items = [itemTestNew, itemTestNew2]
    await order.save() // insert
    expect(order.id).to.be.a('number')
    await order.save() // update (because on dulicate)
    await order.delete()
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
    expect(await customerTestNew2.delete(), 'effectedRows').equals(1)
    expect(customerTestNew2.id).to.be.a('undefined')
    expect(await itemTestNew2.delete(), 'effectedRows').equals(1)
    expect(itemTestNew2.id).to.be.a('undefined')
  })
  it('after delete references (Shop&Item&Customer), nothing should be found', async () => {
    expect(await Shop.find(new WhereClause('id = ?', [shopTest.id]))).has.lengthOf(0)
    expect(await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))).has.lengthOf(0)
    expect(await Item.find(new WhereClause('id = ?', [itemTestNew.id]))).has.lengthOf(0)
    expect(await Customer.find(new WhereClause('id = ?', [customerTestNew.id]))).has.lengthOf(0)
  })
  it('toPlainObject should only return attributes', () => {
    remarkNew = new Remark()
    remarkNew.text = 'test'
    customerTestNew2 = new Customer()
    customerTestNew2.name = 'Testi Mc Testface'
    itemTestNew2 = new Item()
    itemTestNew2.description = 'Test test test'
    const order = new Order()
    order.amount = 1337
    order.shop = shopTest
    order.customer = customerTestNew2
    order.remarks = [remarkNew]
    order.items = [itemTestNew, itemTestNew2]
    const obj = order.toPlainObject()
    expect(obj._validators).to.be.a('undefined')
    expect(obj.errors).to.be.a('undefined')
    expect(obj.customer._validators).to.be.a('undefined')
    expect(obj.customer.errors).to.be.a('undefined')
    expect(obj.items[0]._validators).to.be.a('undefined')
    expect(obj.items[0].errors).to.be.a('undefined')
    expect(obj.amount).equals(1337)
    expect(obj.customer.name).equals('Testi Mc Testface')
    expect(obj.items[0].description).equals('Pizza')
    expect(() => order.toPlainObject(1)).to.throw(Error, 'max depth of recursion reached')
  })
})
