const describe = require('mocha').describe
const it = require('mocha').it
const expect = require('chai').expect
const MySqlDatabaseConnection = require('./MySqlDatabaseConnection')
const WhereClause = require('../WhereClause')
const TableShema = require('../tableShema/TableShema')
const dbConfig = require('../../example/db.config')

describe('MySqlDatabaseConnection', () => {
  it('should be defined', () => {
    expect(MySqlDatabaseConnection).to.be.a('Function')
  })
  it('createInsertQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    const query = conn.createInsertQuery('testTable', attrMap)
    expect(query).to.be.a('string')
  })
  it('createFindQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const whereClause = new WhereClause('a = ? AND (b = ? OR c = ?)', [1, 2, 3])
    const query = conn.createFindQuery('testTable', whereClause)
    expect(query).to.be.a('string')
  })
  it('createUpdateQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    const query = conn.createUpdateQuery('testTable', attrMap)
    expect(query).to.be.a('string')
  })
  it('createDeleteQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const whereClause = new WhereClause('a = ? AND (b = ? OR c = ?)', [1, 2, 3])
    const query = conn.createDeleteQuery('testTable', whereClause)
    expect(query).to.be.a('string')
  })
  it('createSaveQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    const query = conn.createSaveQuery('testTable', attrMap)
    expect(query).to.be.a('string')
  })
  it('getTableNames should return string list', async () => {
    const testDbConnection = new MySqlDatabaseConnection(dbConfig)
    const tableNames = await testDbConnection.getTableNames()
    expect(tableNames).to.contains('example')
  })
  it('getTableShema should return TableShema', async () => {
    const testDbConnection = new MySqlDatabaseConnection(dbConfig)
    const tableShema = await testDbConnection.getTableShema('example')
    expect(tableShema).to.be.instanceof(TableShema)
  })
})
