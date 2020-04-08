const User = require('../models/user');

let UserService = {};

UserService.saveUser = async function (nuserId, nusername){
	try {
		await User.updateOne({userId: nuserId}, {username: nusername}, { new: true, upsert: true });
	} catch (err) {
		logger.error(`Can't create user: ${err}`);
	}
};

UserService.getSavedUsersCount = async function () {
	return await User.estimatedDocumentCount();
};

UserService.getUserId = async function (username) {
	let id;
	try{
		id = await User.findOne({username}, 'userId', {lean: true}); 
	} catch(err) {
		logger.error(`Can't find user: ${err}`);
	}
	// Technically, lean SHOULD return an object not a document already... but...
	return await id.userId;
};

module.exports = UserService;