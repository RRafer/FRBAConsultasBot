// @ts-check
// Refactored this on another branch already
const mongo = require('mongodb').MongoClient;
const logger = require('../../controllers/logger');

const url = 'mongodb://localhost:27017';

//Estructura:
//chatId - number
//errorMsg - string
//type - string

exports.logError = (error, chatId) => {
	logger.error(`Unpecified Error in errors.js: ${error}`);
	mongo.connect(url, (err, client) => {
		if(client == undefined || client == null) return;
        
		const db = client.db('telegram');
		const col = db.collection('errors');
  
		if(err || !error) return;
        
		col.insertOne({'chatId': chatId, 'errorMsg': error.message, 'date': new Date().toDateString()}, (err, result) => {
			client.close();

			if(err) return;
		});
	});
};