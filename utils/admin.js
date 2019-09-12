let callbackObject = {
	a: '', // Action
	p: [], // Parameters
};

exports.validateUser = bot => (msg) => {
	console.log(msg);
	if (msg.new_chat_member !== undefined) {
		bot.emit('new_member', msg);
	}
};

exports.verify = (msg) => {
	callbackObject.action = 'v';
	callbackObject.p[0] = msg.from.id;
	callbackObject.p[1] = msg.message_id;
	const inlineKeyboard = {
		inline_keyboard: [
			[
				{ text: 'Haga clic aquí', callback_data: JSON.stringify(callbackObject) },
			],
		],
	};
	return (inlineKeyboard);
};

exports.RemPerms = {
	perms: {
		can_send_message: false,
		can_send_media_messages: false,
		can_send_other_messages: false,
		can_add_web_page_previews: false,
	},
};

exports.GivePerms = {
	perms: {
		can_send_message: true,
		can_send_media_messages: false,
		can_send_other_messages: false,
		can_add_web_page_previews: false,
	},
};
