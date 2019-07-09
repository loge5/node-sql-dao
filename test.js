var Mocha = require('mocha')
var mocha = new Mocha({})
mocha.addFile('lib/DatabaseAccessObject.spec')
mocha.addFile('lib/DatabaseConnection.spec')
mocha.addFile('lib/testData/Example.spec')
mocha.addFile('lib/testData/Order.spec')
mocha.addFile('lib/Model.spec')
mocha.addFile('lib/Validator.spec')
mocha.addFile('lib/WhereClause.spec')

// Validators
mocha.addFile('lib/validators/RequiredValidator.spec')
mocha.addFile('lib/validators/LengthValidator.spec')
mocha.addFile('lib/validators/NumericValidator.spec')

// DatabaseConnections
mocha.addFile('lib/databaseConnections/MySqlDatabaseConnection.spec')

// TableShema
mocha.addFile('lib/tableShema/Column.spec')
mocha.addFile('lib/tableShema/TableShema.spec')
mocha.addFile('lib/tableShema/Relation.spec')
mocha.addFile('lib/tableShema/RelationBelongsTo.spec')
mocha.addFile('lib/tableShema/RelationHasMany.spec')
mocha.addFile('lib/tableShema/RelationHasOne.spec')
mocha.addFile('lib/tableShema/RelationManyMany.spec')

// Generator
mocha.addFile('lib/Generator.spec')

mocha.run()
