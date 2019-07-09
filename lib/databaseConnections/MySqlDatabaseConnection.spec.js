const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const MySqlDatabaseConnection = require('./MySqlDatabaseConnection')
const WhereClause = require('../WhereClause')
const TableShema = require('../tableShema/TableShema')
const dbConfig = require('../testData/db.config')

describe('MySqlDatabaseConnection', () => {
  it('should be defined', () => {
    expect(MySqlDatabaseConnection).to.be.a('Function')
  })
  it('createInsertQuery should return string', () => {
    let conn = new MySqlDatabaseConnection({})
    let attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    let query = conn.createInsertQuery('testTable', attrMap)
    expect(query).to.be.a('string')
  })
  it('createFindQuery should return string', () => {
    let conn = new MySqlDatabaseConnection({})
    let whereClause = new WhereClause('a = ? AND (b = ? OR c = ?)', [1, 2, 3])
    let query = conn.createFindQuery('testTable', whereClause)
    expect(query).to.be.a('string')
  })
  it('createUpdateQuery should return string', () => {
    let conn = new MySqlDatabaseConnection({})
    let attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    let query = conn.createUpdateQuery('testTable', attrMap)
    expect(query).to.be.a('string')
  })
  it('createDeleteQuery should return string', () => {
    let conn = new MySqlDatabaseConnection({})
    let whereClause = new WhereClause('a = ? AND (b = ? OR c = ?)', [1, 2, 3])
    let query = conn.createDeleteQuery('testTable', whereClause)
    expect(query).to.be.a('string')
  })
  it('createSaveQuery should return string', () => {
    let conn = new MySqlDatabaseConnection({})
    let attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    let query = conn.createSaveQuery('testTable', attrMap)
    expect(query).to.be.a('string')
  })
  it('getTableNames should return string list', async () => {
    let testDbConnection = new MySqlDatabaseConnection(dbConfig)
    let tableNames = await testDbConnection.getTableNames()
    expect(tableNames).to.contains('example')
  })
  it('getTableShema should return TableShema', async () => {
    let testDbConnection = new MySqlDatabaseConnection(dbConfig)
    let tableShema = await testDbConnection.getTableShema('example')
    expect(tableShema).to.be.instanceof(TableShema)
  })
})
