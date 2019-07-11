[![npm version](https://badge.fury.io/js/sql-dao.svg)](http://badge.fury.io/js/sql-dao)
[![Dependencies](https://david-dm.org/loge5/node-sql-dao.svg)](https://david-dm.org/loge5/node-sql-dao) 
[![devDependencies Status](https://david-dm.org/loge5/node-sql-dao/dev-status.svg)](https://david-dm.org/loge5/node-sql-dao?type=dev)

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

For an example output see [./example/Example.js](./example/Example.js)

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

For defining relations you can override the `getRelations` method.
Then `find` will automaticly load other DAO's and also on `insert, update, delte, save` the referenced object will be created/deleted.

Example:

![erm-image](example/erm.png "Example ERM")

```JavaScript
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
Conplete file: [./example/Order.js](./example/Order.js)

### find

* will fetch any referenced objects
* ⚠️ Don't create recursive relations (e.g. belongsTo in Order & hasOne in Shop)

### insert

* will insert any referenced objects and relations (ManyMany)

### update

* will delete "hasMany" referenced objects (when removed from array)
* will delete "ManyMany" **relations** (when removed from array)
* will not delete missing references on "hasOne" or "belongsTo"

### delete

* only deletes "hasMany" and relations from "ManyMany", rest could be used somewhere else
* for other you can override the beforeDelete/afterDelete methods

### save

* `@todo`

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
