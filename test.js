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
mocha.addFile('lib/validators/LengthValidator.spec')
mocha.addFile('lib/validators/NumericValidator.spec')

// DatabaseConnections
mocha.addFile('lib/databaseConnections/MySqlDatabaseConnection.spec')

// Generator
mocha.addFile('lib/TableColumn.spec')
mocha.addFile('lib/TableShema.spec')
mocha.addFile('lib/Generator.spec')

mocha.run()
