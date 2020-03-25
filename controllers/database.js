require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../utils/mongo/models/userModel');
const logger = require('./logger');

// Mongo Config
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/telegrambot';
let Database = {};

Database.initDb = function (){
	mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
	let db = mongoose.connection;
	db.on('error', ()=>{logger.error('DB Connection error');});
	db.once('open', function() {
		logger.info('DB Connected');
	});
};

Database.saveUser = async function (userId, userName){
	logger.info(`Logging into database: ${userId}=>${userName}`);
	await userModel.create({userId, userName}).catch(err => logger.error(`Can't create user: ${err}`));
};

Database.getSavedUsers = async function (){
	let userMap = new Map();

	// Note no `await` here
	const cursor = userModel.find().cursor();

	for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
		userMap.set(doc.userId, doc.userName);
	}

	return userMap;
};

// exports.insertMessage = (msg) => {
// exports.hasStarted = userId => {
// exports.setStartedUser = userId => {  

module.exports = Database;