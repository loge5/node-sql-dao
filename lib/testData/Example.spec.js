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
    let model = new Example()
    expect(model.validate()).to.equal(false)
    expect(model.errors).to.have.lengthOf(3)
    model.id = 1
    expect(model.validate()).to.equal(false)
    expect(model.errors).to.have.lengthOf(2)
    model.name = 'test'
    expect(model.validate()).to.equal(false)
    expect(model.errors).to.have.lengthOf(1)
    model.created = new Date()
    expect(model.validate()).to.equal(true)
    expect(model.errors).to.have.lengthOf(0)
  })
  it('find should return Example', async () => {
    let result = await Example.find()
    expect(result).to.have.lengthOf(2)
    expect(result[0]).to.be.instanceof(Example)
  })
  it('insert should set primary key', async () => {
    let example = new Example()
    example.name = 'uTest'
    await example.insert()
    expect(example.id).to.be.a('number')
    lastInsertedId = example.id
  })
  it('delete (pk) should hit 1 row', async () => {
    if (typeof lastInsertedId !== 'number') {
      throw Error('skip test because insert failed')
    }
    let example = new Example()
    example.id = lastInsertedId
    let affected = await example.delete()
    expect(affected).to.be.a('number')
    expect(affected).equal(1)
  })
  it('save (insert) should set primary key', async () => {
    let example = new Example()
    example.name = 'uTest'
    await example.save()
    expect(example.id).to.be.a('number')
    lastInsertedId = example.id
  })
  it('save (update) should set primary key', async () => {
    let example = new Example()
    example.id = lastInsertedId
    example.name = 'uTest2'
    await example.save()
    expect(example.id).to.be.a('number')
  })
  it('delete (no pk) should hit 1 row', async () => {
    let example = new Example()
    example.name = 'uTest2'
    let affected = await example.delete()
    expect(affected).to.be.a('number')
    expect(affected).equal(1)
  })
})
