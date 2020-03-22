const logger = require('../controllers/logger');

exports.generateMention = (msg) => {
	const {username, first_name, last_name, id} = msg.from;
	const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
	return `[@${username||fromName}](tg://user?id=${id})`;
};

exports.getUserStatus = async (bot, msg) => {
	logger.info('Getting user credentials');
	await bot.getChatMember(msg.chat.id, msg.from.id)
			.then(userMember => userMember.status)
			.catch(err => logger.error(`Cannot get user: ${err}`));
};

exports.isAdmin = (bot, msg, userId) => ['creator', 'administrator'].includes(getUserStatus(bot, msg));