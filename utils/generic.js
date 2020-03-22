const logger = require('../controllers/logger');

exports.generateMention = (msg) => {
	const {username, first_name, last_name, id} = msg.from;
	const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
	return `[@${username||fromName}](tg://user?id=${id})`;
};

exports.getUserStatus = (bot, msg) => {
	logger.info('Getting user credentials');
	return bot.getChatMember(msg.chat.id, msg.from.id)
			.then(userMember => userMember.status)
			.catch(err => logger.error(`Cannot get user: ${err}`));
};

exports.isAdmin = (bot, msg, userId) => {
	const status = getUserStatus(bot, msg);
	
	return status == 'creator' || status == 'administrator';
};