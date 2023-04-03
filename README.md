[![npm version](https://badge.fury.io/js/sql-dao.svg)](http://badge.fury.io/js/sql-dao)

# node-sql-dao

**Data access objects providing an abstract interface to persistence. So you can use them as usual Objects (in OOP) and simply call the "save" method to store them, without messing around with database specific things like SQL statements.**

# Table of Contents
1. [Features](#Features)
2. [Installation](#Installation)
3. [Example DatabaseAccessObject](#Example-DatabaseAccessObject)
4. [Methods (CRUD & Validate)](#Methods-(CRUD-&-Validate))
5. [Custom Queries](#Custom-Queries)
6. [Relations](#Relations)
7. [Transactions](#Transactions)
8. [Generator](#Generator)
9. [Contributing & Development](#Contributing-&-Development)

# Features

- The *abstract* `DatabaseAccessObject` class providing easy methods for CRUD (create, read, update, delete)
- Also create, read, update, delete relations
- Model validation (required, length, numeric, ...)
- Extensible: add own validators, databases, etc.
- Supports transactions (rollback)
- **Generate the DAO directly from your database schema**

## TODOs

- Generate relations
- Add more validators (e.g. date)
- Add more databases (for now only **MySQL**)

# Installation

```
npm install sql-dao
```
# Example DatabaseAccessObject

Just extends the `DatabaseAccessObject`

```javascript
const DatabaseAccessObject = require('sql-dao').DatabaseAccessObject
// ... more includes ...

class Example extends DatabaseAccessObject {
  // override the abstact methods
}
```

**Take a look on a complete file: [./Example.js](./Example.js)**

# Methods (CRUD & Validate)

The DatabaseAccessObject provides easy methods for CRUD.

## Create

```javascript
let example = new Example()
example.name = 'Test'
await example.insert()
console.log('inserted with PK: ' + example.id)
```

## Read
```javascript
// find all
let examples = await Example.find()

// find some
let whereClause = new WhereClause('?? = ?', ['name','Test']) // will prepare params
let examples2 = await Example.find(whereClause)

// use model as search template
let example = new Example()
example.name = 'Test'
let examples3 = await example.search()
```
## Update

```javascript
let example = new Example()
example.id = 1 // PrimaryKey
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

```javascript
let example = new Example()
example.id = 1 // PrimaryKey
await example.delete()
```

## Validate
```javascript
let example = new Example()
example.name = 'Test'
if (example.validate()) {
  example.save()
} else {
  console.error(example.errors.join("\n"))
}
```

# Custom Queries

You could also send a custom query in the model like this:

```javascript
class Order extends DatabaseAccessObject {
  findLastId () {
    const db = this.getDatabaseConnection()
    let query = 'SELECT MAX(id) FROM ?? WHERE active = ?'
    query = db.prepareQuery(query, ['order', 1])
    const result = await db.sendQuery(query)
    // parse query
  }

  // ...
}
```


# Relations

For defining relations you can override the `getRelations` method.

**Example:**

![erm-image](example/erm.png "Example ERM")

```javascript
// ...
class Order extends DatabaseAccessObject {
  /**
   * @returns {Relation[]}
   */
  static getRelations () {
    return [
      new RelationBelongsTo('shop', 'shopId', Shop, 'id'),
      new RelationHasOne('customer', 'customerId', Customer, 'id'),
      new RelationHasMany('remarks', 'id', Remark, 'orderId'),
      new RelationManyMany('items', 'id', Item, 'id', 'item_order', 'orderId', 'itemId')
    ]
  }
  // ...
}
```
Complete file: [./example/Order.js](./example/Order.js)

## Notices about relations

**⚠️ Don't create recursive relations (e.g. belongsTo in Order & hasOne in Shop)**

### find

* will fetch any referenced objects

### insert

* will insert any new referenced objects and relations (ManyMany)
* will update existing referenced objects

### update

* will insert referenced objects with undefined primary key
* will update referenced objects with defined primary key
* will delete "hasMany" referenced objects (when removed from array)
* will delete "ManyMany" **relations** (when removed from array)
* will not delete missing referenced objects on "hasOne" or "belongsTo"

### delete

* only deletes "hasMany" and relations from "ManyMany", rest could be used somewhere else
* for other you can override the beforeDelete/afterDelete methods

### save

* will save (insert on duplicate update) referenced objects
* will delete "hasMany" referenced objects (when removed from array)
* will delete "ManyMany" **relations** (when removed from array)
* will not delete missing referenced objects on "hasOne" or "belongsTo"

# Transactions

```javascript
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

# Generator

First create a config file for database (see [https://www.npmjs.com/package/mysql](https://www.npmjs.com/package/mysql)):

```javascript
// just an example
module.exports = {
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'dao_example'
}
```

Then call the generator script.


Usage:
```shell
Usage: gen-mysql [options]

Options:
  -c, --config <path>       path to db config file
  -t, --table <name>        table name (otherwise all)
  -d, --destination <path>  path where files should be created (default: ".")
  -h, --help                output usage information
```

Example:
```shell
$ node ./node_modules/sql-dao/gen-mysql.js -c ./config/db.config.js -t example -d ./lib
```

For an example output see [./Example.js](./Example.js)

# Contributing & Development

## Style

[https://github.com/standard/standard](https://github.com/standard/standard)

## Testing

Set up test database:

* put config here: [./example/db.config.js](./example/db.config.js)
* insert testdata from here: [./example/testdata.sql](./example/testdata.sql)

Run mocha tests:

`npm test`

Check code coverage (creates "./coverage/index.html"):

`npm run-script cover`

## Release

Using: [https://github.com/conventional-changelog/standard-version](https://github.com/conventional-changelog/standard-version)

On master branch:

`npm run release`
