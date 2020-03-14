const MongoClient = require('mongodb').MongoClient;

// Mongo Config
const url = 'mongodb://localhost:27017';
const dbName = 'telegrambot';
let _db = undefined;
let connecting = false;
let Database = function(){};

Database.initDb = async function (){
	let con = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
	_db = con.db(dbName);
};

Database.getDb = async function (){
	if (_db == undefined && connecting == false){
		console.log('DB Not started... connecting');
		connecting = true;
		await Database.initDb();
		console.log('Connected');
	}
	return _db; 
};

module.exports = Database;