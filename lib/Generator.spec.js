const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const Generator = require('./Generator')
const TableShema = require('./TableShema')
const TableColumn = require('./TableColumn')
const TableColumnType = require('./TableColumnType')

describe('Generator', () => {
  it('should be defined', () => {
    expect(Generator).to.be.a('Function')
  })
  it('createClass should return string', () => {
    let tableShema = new TableShema()
    tableShema.name = 'example'
    tableShema.primaryKey = 'id'
    let col1 = new TableColumn()
    col1.field = 'id'
    col1.isPrimaryKey = true
    col1.required = true
    col1.type = new TableColumnType()
    col1.type.type = 'integer'
    col1.type.min = 0
    tableShema.columns.push(col1)
    let col2 = new TableColumn()
    col2.field = 'name'
    col2.type = new TableColumnType()
    col2.type.type = 'string'
    col2.type.max = 100
    tableShema.columns.push(col2)
    let col3 = new TableColumn()
    col3.field = 'created'
    col3.type = new TableColumnType()
    col3.type.type = 'Date'
    tableShema.columns.push(col3)
    let generator = new Generator()
    let classContent = generator.createClass(tableShema)
    expect(classContent).to.be.a('string')
    console.log(classContent)
  })
})
