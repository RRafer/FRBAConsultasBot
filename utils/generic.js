exports.generateMention = (msg) => {
	const {username, first_name, last_name, id} = msg.from;
	const fromName = `${first_name}${last_name ? ` ${last_name}` : ''}`;
	return `[@${username||fromName}](tg://user?id=${id})`;
};