const MongoClient = require('mongodb').MongoClient;
const logger = require('./logger');

// Mongo Config
const url = 'mongodb://localhost:27017';
const dbName = 'telegrambot';
let _db = undefined;
let Database = function(){};

Database.initDb = async function (){
	_db = (await MongoClient.connect(url)).db(dbName);
};

Database.getDb = async function (){
	if (_db == undefined){
		logger.info('DB Not started... connecting');
		await Database.initDb();
		logger.info('Connected');
	}
	return _db; 
};

module.exports = Database;