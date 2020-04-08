const logger = require('../controllers/logger');

exports.generateMention = (msg) => {
	const {username, first_name, last_name, id} = msg.from;
	const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
	return `[@${username||fromName}](tg://user?id=${id})`;
};

getUserStatus = async (bot, msg, extraParams) => {
	const user = await bot.getChatMember(extraParams.chatID || msg.chat.id, extraParams.userID || msg.from.id);
	if (!user) return logger.error(`Cannot get user: ${err}`);
	return user.status;
};

exports.isAdmin = async (bot, msg, extraParams = {}) => ['creator', 'administrator'].includes(await getUserStatus(bot, msg, extraParams));