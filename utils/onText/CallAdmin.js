exports.execute = (bot, msg) => {
	if (!msg.reply_to_message){
		bot.sendMessage(msg.chat.id, 'Debe responder a un mensaje para poder contactar a los administradores.\nEl uso inapropiado puede conllevar sanciones', {reply_to_message_id: msg.message_id});
		return;
	}
	let nombre = `${msg.from.first_name}${msg.from.last_name ? ` ${msg.from.last_name}` : ''}`;
	let moddedChat = String(msg.chat.id).substring(4).trim();
	let chat = `${msg.chat.username ? `${msg.chat.username}`: `c/${moddedChat}`}`;
    
	bot.getChatAdministrators(msg.chat.id).then(admins => {
		admins.forEach(admin => {
			if(!admin.user.is_bot)
				bot.sendMessage(admin.user.id, `El usuario [@${msg.from.username||nombre}](tg://user?id=${msg.from.id}) ha solicitado la presencia de un administrador en el grupo ${msg.chat.title}`, {parse_mode: 'Markdown', reply_markup: {
					inline_keyboard: [[{
						text: 'Ir al mensaje',
						url: `https://t.me/${chat}/${msg.reply_to_message.message_id}`,
					}]],
				}}).catch(e => e);
		});
	});
};