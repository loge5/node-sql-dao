const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Generator = require('./Generator')
const TableShema = require('./tableShema/TableShema')
const Column = require('./tableShema/Column')
const ColumnType = require('./tableShema/ColumnType')

describe('Generator', () => {
  it('should be defined', () => {
    expect(Generator).to.be.a('Function')
  })
  it('createClass should return string', () => {
    const tableShema = new TableShema()
    tableShema.name = 'example'
    tableShema.primaryKey = 'id'
    const col1 = new Column()
    col1.field = 'id'
    col1.isPrimaryKey = true
    col1.required = true
    col1.type = new ColumnType()
    col1.type.type = 'integer'
    col1.type.min = 0
    tableShema.columns.push(col1)
    const col2 = new Column()
    col2.field = 'name'
    col2.type = new ColumnType()
    col2.type.type = 'string'
    col2.type.max = 100
    tableShema.columns.push(col2)
    const col3 = new Column()
    col3.field = 'created'
    col3.type = new ColumnType()
    col3.type.type = 'Date'
    tableShema.columns.push(col3)
    const generator = new Generator()
    const classContent = generator.createClass(tableShema)
    expect(classContent).to.be.a('string')
  })
})
