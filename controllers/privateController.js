exports.start = (bot, msg) => {
    if(msg.chat.type == 'private')
        bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}!
    
Soy un bot creado para los grupos no oficiales de la UTN FRBA en Telegram
    
Ingresa acá el comando que quieras usar, o usá /help para conocer todos mis comandos!`);
    else
        bot.sendMessage(msg.chat.id, `Este comando solo puede utilizarse en chats privados`, { reply_to_message_id: msg.message_id });
}