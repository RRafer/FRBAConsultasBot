require('dotenv').config();
const mongoose = require('mongoose');
const userModel = require('../utils/mongo/models/userModel');
const logger = require('./logger');

// Mongo Config
const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/telegrambot';
let Database = {};

Database.initDb = function (){
	mongoose.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
	let db = mongoose.connection;
	db.on('error', ()=>{logger.error('DB Connection error');});
	db.once('open', function() {
		logger.info('DB Connected');
	});
};

Database.saveUser = async function (nuserId, nusername){
	try{
		await userModel.updateOne({userId: nuserId}, {username: nusername}, { new: true, upsert: true });
	}catch(err){
		logger.error(`Can't create user: ${err}`);
	}
};

Database.getSavedUsersCount = async function (){
	return await userModel.estimatedDocumentCount();
};

Database.getUserId = async function (nusername){
	let id;
	try{
		id = await userModel.findOne({username: nusername}, 'userId',{lean: true}); 
	}catch(err){
		logger.error(`Can't find user: ${err}`);
	}
	// Technically, lean SHOULD return an object not a document already... but...
	return await id.userId;
};

module.exports = Database;