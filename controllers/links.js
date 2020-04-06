// @ts-check
// TODO: Refactor this.
const logger = require('./logger');
const inlineKeyboard = require('../resources/links.json');

exports.sendLinks = (bot, msg) => {
	bot.sendMessage(msg.chat.id, 'LINKS', {
		reply_markup: {
			inline_keyboard: inlineKeyboard,
		},
		reply_to_message_id: msg.message_id,
	});

	const msgLinks = msg.message_id + 1;

	bot.on('callback_query', (link) => {
		logger.info(`Recieved Callback Query: ${link}`);

		if (!link.from.id === link.message.reply_to_message.from.id)
			return bot.answerCallbackQuery({callback_query_id: link.id, text: 'No puede verificar por otro usuario', show_alert: true});

		if (link.data === 0) 
			return bot.editMessageText('LINKS', {reply_markup: {inline_keyboard: inlineKeyboard}, message_id: msgLinks, chat_id: msg.chat.id});

		let groups = require(`../resources/groups/${link.data}`);
		groups.push([{text: 'Atras', callback_data: 0}]);

		bot.editMessageText('GRUPOS', {chat_id: msg.chat.id, message_id: msgLinks, reply_markup: {inline_keyboard: groups}});
		groups.pop();
	});
};