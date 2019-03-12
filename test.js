var Mocha = require('mocha')
var mocha = new Mocha({})
mocha.addFile('lib/DatabaseAccessObject.spec')
mocha.addFile('lib/DatabaseConnection.spec')
mocha.addFile('lib/testData/Example.spec')
mocha.addFile('lib/Model.spec')
mocha.addFile('lib/Validator.spec')
mocha.addFile('lib/WhereClause.spec')

// Validators
mocha.addFile('lib/validators/RequiredValidator.spec')

// DatabaseConnections
mocha.addFile('lib/databaseConnections/MySqlDatabaseConnection.spec')

mocha.run()
