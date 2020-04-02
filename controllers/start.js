exports.execute = (bot, msg) => {
    return bot.sendMessage(msg.chat.id, msg.chat.type == 'private' ? `Hola ${msg.from.first_name}!
    
Soy un bot creado para los grupos no oficiales de la UTN FRBA en Telegram
    
Ingresa acá el comando que quieras usar, o usá /help para conocer todos mis comandos!` : 'Este comando funciona únicamente en los chats privados', { reply_to_message_id: msg.chat.type == 'private' ? '' : msg.message_id })
}