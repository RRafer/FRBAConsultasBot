require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const logger = require('./logger');

// Mongo Config
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const dbName = process.env.DATABASE_NAME || 'telegrambot';
let _db;
let connecting = false;
let Database = function(){};

Database.initDb = async function (){
	let con = await MongoClient.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
	_db = con.db(dbName);
};

Database.getDb = async function (){
	if (_db == undefined && connecting == false){
		logger.info('DB Not started... connecting');
		connecting = true;
		await Database.initDb();
		logger.info('Connected');
	}
	return _db; 
};



//#region Comentarios

// exports.setStartedUser = (userId, chatId) => users.setStartedUser(userId).catch(err => errors.logError(err, chatId));
// exports.getPrivateChatId = (userId, chatId) => users.getPrivateChatId(userId).catch(err => errors.logError(err, chatId));
// exports.hasStarted = (userId, chatId) => users.hasStarted(userId).catch(err => errors.logError(err, chatId));


// Mongo Singleton Use Example
// Placeholder name, change for each collection.
/* const collectionName = 'mensajes';

async function getdocs() {
	let collection;
	(await db.getDb()).then((db)=> {collection = db.collection(collectionName);});
	collection.find({}).toArray(function(err, docs) {
		if (!err)
			console.log(`Se han cargado ${docs.length} documentos`);
	});
}
*/
//#endregion


module.exports = Database;