 const generic = require('../generic');

exports.execute = (bot, msg) => {
    return new Promise((resolve, reject) => {
        if (msg.chat.type == 'private') {
            bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}!\n\nSoy un bot creado para los grupos no oficiales de la UTN FRBA en Telegram\n\nIngresa acá el comando que quieras usar, o usá /help para conocer todos mis comandos!`)
        }
        else{
            bot.sendMessage(msg.chat.id, `Este comando funciona únicamente en los chats privados`, { reply_to_message_id: msg.message_id })
        }
    });
    
}