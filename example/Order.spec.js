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
    expect(typeof Order).toBe('function')
  })
  it('insert references (Shop&Item) should set id', async () => {
    shopTest = new Shop()
    shopTest.name = 'Test Shop'
    await shopTest.insert()
    expect(typeof shopTest.id).toBe('number')
    itemTestExisting = new Item()
    itemTestExisting.description = 'Mate'
    await itemTestExisting.insert()
    expect(typeof itemTestExisting.id).toBe('number')
  })
  it('find references (Shop&Item) should find shop with same id', async () => {
    const shops = await Shop.find(new WhereClause('id = ?', [shopTest.id]))
    expect(shops[0]).toBeInstanceOf(Shop)
    expect(shops[0].id).toBe(shopTest.id)
    const items = await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))
    expect(items[0]).toBeInstanceOf(Item)
    expect(items[0].id).toBe(itemTestExisting.id)
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
    expect(typeof orderTest.id).toBe('number')
    expect(typeof orderTest.shop.id).toBe('number')
    expect(typeof orderTest.customer.id).toBe('number')
    expect(typeof orderTest.remarks[0].id).toBe('number')
    expect(typeof orderTest.remarks[1].id).toBe('number')
    expect(orderTest.items).toHaveLength(2)
  })
  it('find order should find inserted order with relations', async () => {
    const result = await Order.find(new WhereClause('id = ?', [orderTest.id]))
    expect(result.length).toBeGreaterThan(0)
    expect(result[0].shop.name).toBe(shopTest.name)
    expect(result[0].customer).toBeInstanceOf(Customer)
    expect(result[0].items).toHaveLength(2)
    expect(result[0].items[0].description).toBe('Mate')
    expect(result[0].remarks).toHaveLength(2)
    expect(result[0].remarks[0].text).toBe('Extra cheeese')
    expect(result[0].remarks[1].text).toBe('olives please')
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
    expect(result.length).toBeGreaterThan(0)
    const orderCheck = result[0]
    expect(orderCheck.amount).toBe(12)
    expect(orderTest.customer.name).toBe('Testi')
    expect(orderTest.remarks[0].text).toBe('Extra Extra cheeese')
    expect(result[0].remarks).toHaveLength(1)
    expect(await Remark.find(new WhereClause('id = ?', [remarkTest2.id]))).toHaveLength(0)
    expect(orderTest.items).toHaveLength(1)
    expect(orderTest.items[0].description).toBe('Mate!')
    expect(orderTest.shop.name).toBe('Test Shop2')
  })
  it('delete order should only delete hasMany relations', async () => {
    const affectedRows = await orderTest.delete()
    expect(typeof affectedRows).toBe('number')
    expect(affectedRows).toBeGreaterThan(0)
    expect(await Shop.find(new WhereClause('id = ?', [shopTest.id]))).toHaveLength(1)
    expect(await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))).toHaveLength(1)
    expect(await Item.find(new WhereClause('id = ?', [itemTestNew.id]))).toHaveLength(1)
    expect(await Customer.find(new WhereClause('id = ?', [customerTestNew.id]))).toHaveLength(1)
    expect(await Remark.find(new WhereClause('id = ?', [remarkTest1.id]))).toHaveLength(0)
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
    expect(typeof order.id).toBe('number')
    await order.save() // update (because on dulicate)
    await order.delete()
  })
  it('delete references (Shop&Item&Customer) should unset id', async () => {
    expect(await shopTest.delete()).toBe(1)
    expect(shopTest.id).toBeUndefined()
    expect(await itemTestExisting.delete()).toBe(1)
    expect(itemTestExisting.id).toBeUndefined()
    expect(await itemTestNew.delete()).toBe(1)
    expect(itemTestNew.id).toBeUndefined()
    expect(await customerTestNew.delete()).toBe(1)
    expect(customerTestNew.id).toBeUndefined()
    expect(await customerTestNew2.delete()).toBe(1)
    expect(customerTestNew2.id).toBeUndefined()
    expect(await itemTestNew2.delete()).toBe(1)
    expect(itemTestNew2.id).toBeUndefined()
  })
  it('after delete references (Shop&Item&Customer), nothing should be found', async () => {
    expect(await Shop.find(new WhereClause('id = ?', [shopTest.id]))).toHaveLength(0)
    expect(await Item.find(new WhereClause('id = ?', [itemTestExisting.id]))).toHaveLength(0)
    expect(await Item.find(new WhereClause('id = ?', [itemTestNew.id]))).toHaveLength(0)
    expect(await Customer.find(new WhereClause('id = ?', [customerTestNew.id]))).toHaveLength(0)
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
    expect(obj._validators).toBeUndefined()
    expect(obj.errors).toBeUndefined()
    expect(obj.customer._validators).toBeUndefined()
    expect(obj.customer.errors).toBeUndefined()
    expect(obj.items[0]._validators).toBeUndefined()
    expect(obj.items[0].errors).toBeUndefined()
    expect(obj.amount).toBe(1337)
    expect(obj.customer.name).toBe('Testi Mc Testface')
    expect(obj.items[0].description).toBe('Pizza')
    expect(() => order.toPlainObject(1)).toThrow('max depth of recursion reached')
  })
})
