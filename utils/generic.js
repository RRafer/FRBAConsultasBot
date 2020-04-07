const logger = require('../controllers/logger');

exports.generateMention = (msg) => {
	const {username, first_name, last_name, id} = msg.from;
	const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
	return `[@${username||fromName}](tg://user?id=${id})`;
};

getUserStatus = async (bot, msg) => {
	logger.info('Getting user credentials');
	const userMember = await bot.getChatMember(msg.chat.id, msg.from.id)
		.catch(err => logger.error(`Cannot get user: ${err}`));

	return userMember.status;
};

exports.isAdmin = (bot, msg) => ['creator', 'administrator'].includes(getUserStatus(bot, msg));