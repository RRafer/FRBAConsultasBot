const { groupIDs } = require('../utils/config');
const logger = require('./logger');

exports.excel = async (bot, msg) => {
	logger.info('Checking if group is in the list ' + msg.chat.id);

	// Check group
	if (!groupIDs.includes(msg.chat.id)) return;

	await bot.sendMessage(msg.chat.id, '¿Te fijaste en el <a href=\'https://docs.google.com/spreadsheets/d/19XPRP8zsVut-W1HihBxSZ_mZHlyHMBy-WIKNqurdNs8/edit?pref=2&pli=1#gid=1173209158\'>Excel de profesores</a>?',
		{ 
			parse_mode: 'HTML', 
			reply_to_message_id: msg.reply_to_message ? msg.reply_to_message.message_id : '', 
			disable_web_page_preview: true, 
		}).catch(err => logger.error(`Error sending excel message: ${err}`));	
	
	setTimeout(() => 
		bot.deleteMessage(msg.chat.id, msg.message_id).catch(err => logger.error(`Error deleting excel message: ${err}`)),
	120000);
};