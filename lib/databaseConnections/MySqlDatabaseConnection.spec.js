const MySqlDatabaseConnection = require('./MySqlDatabaseConnection')
const WhereClause = require('../WhereClause')
const TableShema = require('../tableShema/TableShema')
const dbConfig = require('../../example/db.config')

describe('MySqlDatabaseConnection', () => {
  it('should be defined', () => {
    expect(typeof MySqlDatabaseConnection).toBe('function')
  })
  it('createInsertQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    const query = conn.createInsertQuery('testTable', attrMap)
    expect(typeof query).toBe('string')
  })
  it('createFindQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const whereClause = new WhereClause('a = ? AND (b = ? OR c = ?)', [1, 2, 3])
    const query = conn.createFindQuery('testTable', whereClause)
    expect(typeof query).toBe('string')
  })
  it('createUpdateQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    const query = conn.createUpdateQuery('testTable', attrMap)
    expect(typeof query).toBe('string')
  })
  it('createDeleteQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const whereClause = new WhereClause('a = ? AND (b = ? OR c = ?)', [1, 2, 3])
    const query = conn.createDeleteQuery('testTable', whereClause)
    expect(typeof query).toBe('string')
  })
  it('createSaveQuery should return string', () => {
    const conn = new MySqlDatabaseConnection({})
    const attrMap = new Map()
    attrMap.set('a', 1)
    attrMap.set('b', '2')
    const query = conn.createSaveQuery('testTable', attrMap)
    expect(typeof query).toBe('string')
  })
  it('getTableNames should return string list', async () => {
    const testDbConnection = new MySqlDatabaseConnection(dbConfig)
    const tableNames = await testDbConnection.getTableNames()
    expect(tableNames).toContain('example')
  })
  it('getTableShema should return TableShema', async () => {
    const testDbConnection = new MySqlDatabaseConnection(dbConfig)
    const tableShema = await testDbConnection.getTableShema('example')
    expect(tableShema).toBeInstanceOf(TableShema)
  })
  it('transaction (commit) should resolve', async () => {
    const conn = new MySqlDatabaseConnection(dbConfig)
    const transaction = await conn.createTransaction()
    await conn.sendQuery('SHOW TABLES', transaction)
    await conn.commitTransaction(transaction)
  })
  it('transaction (roolback) should resolve', async () => {
    const conn = new MySqlDatabaseConnection(dbConfig)
    const transaction = await conn.createTransaction()
    await conn.sendQuery('SHOW TABLES', transaction)
    await conn.rollbackTransaction(transaction)
  })

  it('prepareQuery should resolve', async () => {
    const conn = new MySqlDatabaseConnection(dbConfig)
    expect(conn.prepareQuery('SELECT MAX(id) FROM ?? WHERE active = ? AND code = ?', ['order', 1, 'ABC'])).toBe('SELECT MAX(id) FROM `order` WHERE active = 1 AND code = \'ABC\'')
  })
})
