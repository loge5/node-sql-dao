const Example = require('./Example')

let lastInsertedId

describe('Example', () => {
  it('should be defined', () => {
    expect(typeof Example).toBe('function')
  })
  it('validate should return false and set errors', () => {
    const model = new Example()
    expect(model.validate()).toBe(false)
    expect(model.errors).toHaveLength(1)
    model.id = 1
    expect(model.validate()).toBe(false)
    expect(model.errors).toHaveLength(1)
    model.name = 'test'
    model.created = new Date()
    expect(model.validate()).toBe(true)
    expect(model.errors).toHaveLength(0)
  })
  it('find should return Example', async () => {
    const result = await Example.find()
    expect(result).toHaveLength(2)
    expect(result[0]).toBeInstanceOf(Example)
  })
  it('insert should set primary key', async () => {
    const example = new Example()
    example.name = 'uTest'
    await example.insert()
    expect(typeof example.id).toBe('number')
    lastInsertedId = example.id
  })
  it('delete (pk) should hit 1 row', async () => {
    if (typeof lastInsertedId !== 'number') {
      throw Error('skip test because insert failed')
    }
    const example = new Example()
    example.id = lastInsertedId
    const affected = await example.delete()
    expect(typeof affected).toBe('number')
    expect(affected).toBe(1)
  })
  it('save (insert) should set primary key', async () => {
    const example = new Example()
    example.name = 'uTest'
    await example.save()
    expect(typeof example.id).toBe('number')
    lastInsertedId = example.id
  })
  it('save (update) should set primary key', async () => {
    const example = new Example()
    example.id = lastInsertedId
    example.name = 'uTest2'
    await example.save()
    expect(typeof example.id).toBe('number')
  })
  it('search should find inserted model', async () => {
    const example = new Example()
    example.name = 'uTest2'
    const findings = await example.search()
    expect(findings.length).toBeGreaterThan(0)
    expect(typeof findings[0].id).toBe('number')
    expect(findings[0].name).toBe(example.name)
  })
  it('delete (no pk) should hit 1 row', async () => {
    const example = new Example()
    example.name = 'uTest2'
    const affected = await example.delete()
    expect(typeof affected).toBe('number')
    expect(affected).toBe(1)
  })
})
