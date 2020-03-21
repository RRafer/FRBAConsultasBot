const { getUserStatus, isAdmin } = require('../utils/generic');
const { groupIDs, excelMessage } = require('../utils/config');
const logger = require('./logger');

exports.excel = async (bot, msg) => {
	logger.info('Checking if group is in the list ' + msg.chat.id);

	// Check group
	if (!msg.reply_to_message || !groupIDs.includes(msg.chat.id)) return;
		
	const status = await getUserStatus(bot, msg);
	if(!isAdmin(status)) return;

	bot.sendMessage(msg.chat.id, excelMessage, 
		{ 
			parse_mode: 'HTML', 
			reply_to_message_id: msg.reply_to_message.message_id, 
			disable_web_page_preview: true 
		})
		.catch(err => logger.error(`Error sending Excel message: ${err}`));
};