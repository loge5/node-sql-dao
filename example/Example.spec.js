const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Example = require('./Example')

let lastInsertedId

describe('Example', () => {
  it('should be defined', () => {
    expect(Example).to.be.a('Function')
  })
  it('validate should return false and set errors', () => {
    const model = new Example()
    expect(model.validate()).to.equal(false)
    expect(model.errors).to.have.lengthOf(1)
    model.id = 1
    expect(model.validate()).to.equal(false)
    expect(model.errors).to.have.lengthOf(1)
    model.name = 'test'
    model.created = new Date()
    expect(model.validate()).to.equal(true)
    expect(model.errors).to.have.lengthOf(0)
  })
  it('find should return Example', async () => {
    const result = await Example.find()
    expect(result).to.have.lengthOf(2)
    expect(result[0]).to.be.instanceof(Example)
  })
  it('insert should set primary key', async () => {
    const example = new Example()
    example.name = 'uTest'
    await example.insert()
    expect(example.id).to.be.a('number')
    lastInsertedId = example.id
  })
  it('delete (pk) should hit 1 row', async () => {
    if (typeof lastInsertedId !== 'number') {
      throw Error('skip test because insert failed')
    }
    const example = new Example()
    example.id = lastInsertedId
    const affected = await example.delete()
    expect(affected).to.be.a('number')
    expect(affected).equal(1)
  })
  it('save (insert) should set primary key', async () => {
    const example = new Example()
    example.name = 'uTest'
    await example.save()
    expect(example.id).to.be.a('number')
    lastInsertedId = example.id
  })
  it('save (update) should set primary key', async () => {
    const example = new Example()
    example.id = lastInsertedId
    example.name = 'uTest2'
    await example.save()
    expect(example.id).to.be.a('number')
  })
  it('search should find inserted model', async () => {
    const example = new Example()
    example.name = 'uTest2'
    const findings = await example.search()
    expect(findings).has.length.greaterThan(0)
    expect(findings[0].id).to.be.a('number')
    expect(findings[0].name).equals(example.name)
  })
  it('delete (no pk) should hit 1 row', async () => {
    const example = new Example()
    example.name = 'uTest2'
    const affected = await example.delete()
    expect(affected).to.be.a('number')
    expect(affected).equal(1)
  })
})
