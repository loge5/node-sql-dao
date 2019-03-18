[![npm version](https://badge.fury.io/js/sql-dao.svg)](http://badge.fury.io/js/sql-dao)
[![Dependencies](https://david-dm.org/loge5/node-sql-dao.svg)](https://david-dm.org/loge5/node-sql-dao) 
[![devDependency Status](https://david-dm.org/loge5/node-sql-dao/dev-status.svg)](https://david-dm.org/loge5/node-sql-dao#info=devDependencies)

# node-sql-dao

**Generate a Database-Access-Object directly from a database table.**

Including validators (e.g. required or numeric) and CRUD methods.

# Features

- Generate model-class directly from Database
- Create, Read, Update, Delete without writing sql
- Model validation (required, length, numeric, ...)
- Extendible: add own validators, databases, etc.

**TODO:**

- Date-Validator
- Handle relations
- Add more Databases (for now only **MySQL**)

# Install

```npm install --save sql-dao```

# Generate a DatabaseAccessObject from Database

create config file for database (see [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)):

```JavaScript
// just an example
module.exports = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'dao_example'
}
```

then call from command line:
```Shell
node ./node_modules/sql-dao/gen-mysql.js <dbConfigFile> <tableName> <targetPath>
```

Example:
```Shell
node ./node_modules/sql-dao/gen-mysql.js ./config/dbconf.js example ./lib
```

For an example output see [./lib/testData/Example.js](./lib/testData/Example.js)

# Usage

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


# Contributing / Development

## Style

[https://github.com/standard/standard](https://github.com/standard/standards)

## Testing

Run mocha tests:

`npm test`

Check code coverage (creates "./coverage/index.html"):

`npm run-script cover`
