# node-sql-dao

[![npm version](https://badge.fury.io/js/sql-dao.svg)](http://badge.fury.io/js/sql-dao)
[![Dependencies](https://david-dm.org/loge5/node-sql-dao.svg)](https://david-dm.org/loge5/node-sql-dao) 
[![devDependency Status](https://david-dm.org/loge5/node-sql-dao/dev-status.svg)](https://david-dm.org/loge5/node-sql-dao#info=devDependencies)

Database-Access-Objects for SQL-Databases

**In early development state (not use now)**

# Features
- CRUD an model without writing sql
- Add validation to a model
- MySql connection included
- genereate DAO directly from datebase

# Install

```npm install --save sql-dao```

# Usage

## Extend from DatabaseAccessObject

```JavaScript
const DatabaseAccessObject = require('sql-dao').DatabaseAccessObject
const MySqlDatabaseConnection = require('sql-dao').MySqlDatabaseConnection
class Example extends DatabaseAccessObject {
  // TODO override abstract methods
}
```
For an example see [./lib/testData/Example.js](./lib/testData/Example.js)

## Generate DatabaseAccessObject from Database
```JavaScript
const MySqlDatabaseConnection = require('sql-dao').MySqlDatabaseConnection
const Generator = require('sql-dao').Generator
const dbConfig = require('./db.config') // your db config
const fs = require('fs')

let tableShema = await testDbConnection.getTableShema('example')
let generator = new Generator()
let classContent = generator.createClass(tableShema, './db.config', 'MySqlDatabaseConnection')
fs.writeFileSync('Example.js', classContent)
```

## Create

```JavaScript
let example = new Example()
example.name = 'Test'
await example.insert()
console.log('inserted with PK: ' + example.id)
```

## Read
```JavaScript
// find all
let examples = await Example.find()

// find some
let whereClause = new WhereClause('?? = ?', ['name','Test']) // will prepare params
let examples2 = await Example.find(whereClause)
```
## Update

```JavaScript
let example = new Example()
example.id = 1 // PrivateKey
example.name = 'Test2'
await example.update()

/*
 * create or on duplicate update
 * e.g. when name is unique constraint in db
 */ 
let example = new Example()
example.name = 'Test2'
await example.save()
```

## Delete

```JavaScript
let example = new Example()
example.id = 1 // PrivateKey
await example.delete()
```

## Validate
```JavaScript
let example = new Example()
example.name = 'Test'
if (example.validate()) {
  example.save()
} else {
  console.error(example.errors.join("\n"))
}
```

## Relations

For now you can use the before/after hooks

```JavaScript
const DatabaseAccessObject = require('sql-dao').DatabaseAccessObject
const MySqlDatabaseConnection = require('sql-dao').MySqlDatabaseConnection

class Example extends DatabaseAccessObject {
  beforeDelete (transaction = undefined) {
    // delete other entry first
    await this.otherDao.delete(transaction)
  }

  // ...
}
```

## Transactions

```JavaScript
/*
 * When an statement fails, rollback previous statements
 */
let dbConn = Example.getDatabaseConnection()
let transaction = dbConn.createTransaction()
let example1 = new Example()
let example2 = new Example()
try {
  await example1.insert(transaction)
  await example2.insert(transaction)
  await dbConn.commitTransaction(transaction)
} catch (e) {
  await dbConn.rollbackTransaction(transaction)
}
```


# Development

## Testing

Run mocha tests:

`npm test`

Check code coverage (creates "./coverage/index.html"):

`npm run-script cover`
