#!/usr/bin/node
const fs = require('fs')
const path = require('path')
const program = require('commander')
const MySqlDatabaseConnection = require('./lib/databaseConnections/MySqlDatabaseConnection')
const Generator = require('./lib/Generator')

program
  .option('-c, --config <path>', 'path to db config file')
  .option('-t, --table <name>', 'table name (otherwise all)')
  .option('-d, --destination <path>', 'path where files should be created', '.')
program.parse(process.argv)

if (!program.config) {
  program.help()
}
const dbConfigPathAbsolute = path.resolve(program.config)
const dbConfigPathRelative = path.relative(program.destination, dbConfigPathAbsolute)
const dbConfig = require(dbConfigPathAbsolute)
let tableNames = []
if (program.table) {
  tableNames = [program.table]
}

async function run (tableNames, dbConfigPath, targetPath) {
  let testDbConnection = new MySqlDatabaseConnection(dbConfig)
  if (tableNames.length === 0) {
    tableNames = await testDbConnection.getTableNames()
  }
  for (let tableName of tableNames) {
    let tableShema = await testDbConnection.getTableShema(tableName)
    let generator = new Generator()
    let classContent = generator.createClass(tableShema, dbConfigPath, 'MySqlDatabaseConnection')
    fs.writeFileSync(path.join(targetPath, generator.createClassName(tableName)) + '.js', classContent)
  }
}
run(tableNames, dbConfigPathRelative, program.destination)
