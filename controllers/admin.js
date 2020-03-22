let callbackObject = {
	a: '', // Action
	p: [], // Parameters
};

/**
 * Returns objet containing keyboard formatted for User Verification
 * @param {Message} msg 
 * @returns {Object} Inline Keyboard
 */
let verify = (msg) => {
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

const RemPerms = {
	perms: {
		can_send_message: false,
		can_send_media_messages: false,
		can_send_other_messages: false,
		can_add_web_page_previews: false,
	},
};

const GivePerms = {
	perms: {
		can_send_message: true,
		can_send_media_messages: false,
		can_send_other_messages: false,
		can_add_web_page_previews: false,
	},
};

module.exports = {
	verify,
	RemPerms,
	GivePerms,
};