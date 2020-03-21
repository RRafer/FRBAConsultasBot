exports.generateMention = (msg) => {
	const {username, first_name, last_name, id} = msg.from;
	const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
	return `[@${username||fromName}](tg://user?id=${id})`;
};

exports.getUserStatus = (bot, msg, logger) => {
	logger.info('Getting user credentials');
	return bot.getChatMember(msg.chat.id, msg.from.id)
			.then(userMember => userMember.status)
			.catch(err => logger.error(`Cannot get user: ${err}`));
};

exports.isAdmin = status => {
	return status == 'creator' || status == 'administrator';
};