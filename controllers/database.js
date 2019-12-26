const MongoClient = require('mongodb').MongoClient;

// Mongo Config
const url = 'mongodb://localhost:27017';
const dbName = 'telegrambot';
let _db = undefined;
let Database = function(){};

Database.initDb = async function (){
	_db = await (await MongoClient.connect(url)).db(dbName);
};

Database.getDb = function (){
	if (_db == undefined){
		console.log('DB Not started... connecting');
		Database.initDb();
		console.log('Connected');
	}
	return _db; 
};

module.exports = Database;