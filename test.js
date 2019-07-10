var Mocha = require('mocha')
var mocha = new Mocha({})
mocha.addFile('lib/DatabaseAccessObject.spec')
mocha.addFile('lib/DatabaseConnection.spec')
mocha.addFile('lib/Model.spec')
mocha.addFile('lib/Validator.spec')
mocha.addFile('lib/WhereClause.spec')
mocha.addFile('lib/Join.spec')

// Validators
mocha.addFile('lib/validators/RequiredValidator.spec')
mocha.addFile('lib/validators/LengthValidator.spec')
mocha.addFile('lib/validators/NumericValidator.spec')

// DatabaseConnections
mocha.addFile('lib/databaseConnections/MySqlDatabaseConnection.spec')

// Releations
mocha.addFile('lib/relation/Relation.spec')
mocha.addFile('lib/relation/RelationHasMany.spec')
mocha.addFile('lib/relation/RelationHasOne.spec')
mocha.addFile('lib/relation/RelationManyMany.spec')

// TableShema
mocha.addFile('lib/tableShema/Column.spec')
mocha.addFile('lib/tableShema/TableShema.spec')

// Generator
mocha.addFile('lib/Generator.spec')

// Example DatabaseAccessObjects
mocha.addFile('lib/testData/Example.spec')
mocha.addFile('lib/testData/Order.spec')

mocha.run()
