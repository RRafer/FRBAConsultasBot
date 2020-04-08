require('dotenv').config();
const mongoose = require('mongoose');

const logger = require('./logger');

// Mongo Config
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/telegrambot';
let Database = {};

Database.initDb = function (){
	mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
	let db = mongoose.connection;
	db.on('error', () => { logger.error('DB Connection error'); });
	db.once('open', function() {
		logger.info('DB Connected');
	});
};

module.exports = Database;