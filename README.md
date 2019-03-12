# node-sql-dao

Database-Access-Objects for SQL-Databases

**In early development state (not use now)**

# Features
- Validation in model
- CRUD of an model without writing sql

## Supported SQL-Databases

- MySql

## TODO

- DAO-Class generator

# Install

```npm install --save sql-dao```

# Usage

```JavaScript
const DatabaseAccessObject = require('sql-dao').DatabaseAccessObject
const MySqlDatabaseConnection = require('sql-dao').MySqlDatabaseConnection
class MyDAO extends DatabaseAccessObject {
  // TODO override abstract methods
}
```

For example Class see [./lib/testData/Example.js](./lib/testData/Example.js)

# Development

## Testing

Run mocha tests:

`npm test`

Check code coverage (creates "./coverage/index.html"):

`npm run-script cover`
