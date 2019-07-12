#!/usr/bin/node
if (process.argv.length !== 5) {
  console.log('usage: node gen-mysql.js <dbConfigFile> <tableName> <targetPath>')
  process.exit(1)
}
const fs = require('fs')
const path = require('path')
const dbConfigPath = process.argv[2]
const dbConfigPathAbsolute = path.resolve(dbConfigPath)
const tableName = process.argv[3]
const targetPath = process.argv[4]
const dbConfigPathRelative = path.relative(targetPath, dbConfigPathAbsolute)
const dbConfig = require(dbConfigPathAbsolute)
const MySqlDatabaseConnection = require('./lib/databaseConnections/MySqlDatabaseConnection')
const Generator = require('./lib/Generator')

async function run (dbConfigPath, dbConfig, tableName, targetPath) {
  let testDbConnection = new MySqlDatabaseConnection(dbConfig)
  let tableShema = await testDbConnection.getTableShema(tableName)
  let generator = new Generator()
  let classContent = generator.createClass(tableShema, dbConfigPath, 'MySqlDatabaseConnection')
  fs.writeFileSync(path.join(targetPath, generator.createClassName(tableName)) + '.js', classContent)
}

run(dbConfigPathRelative, dbConfig, tableName, targetPath)
