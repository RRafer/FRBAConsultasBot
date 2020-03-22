const { getUserStatus, isAdmin } = require('../utils/generic');
const { groupIDs, excelMessage } = require('../utils/config');
const logger = require('./logger');

exports.excel = async (bot, msg) => {
	logger.info('Checking if group is in the list ' + msg.chat.id);

	// Check group
	if (!groupIDs.includes(msg.chat.id)) return;
	
	bot.sendMessage(msg.chat.id, excelMessage,
		{ 
			parse_mode: 'HTML', 
			reply_to_message_id: msg.reply_to_message ? msg.reply_to_message.message_id : '', 
			disable_web_page_preview: true 
		}).then(() => {
			setTimeout(() => 
				bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => logger.error(`Error deleting excel message: ${err}`)),
				120000)
		}).catch(err => logger.error(`Error sending excel message: ${err}`));	
};