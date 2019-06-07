const generic = require('../generic');
const mongo = require('../mongo');

exports.execute = (bot, msg) => {
    var userId = msg.from.id;
    var chatId = msg.chat.id;
    const messageIfHasStarted = 'Utillza /help para ver todos los comandos disponibles.';
    const messageWelcome = 'Bienvenido!';
    
    mongo.hasStarted(userId, chatId).then(res => {
        if(res)
        {
            bot.sendMessage(chatId, messageIfHasStarted);      
        }
        else
        {
            mongo.setStartedUser(userId, chatId).then(() => {
                bot.sendMessage(chatId, messageWelcome + generic.lineBreak + messageIfHasStarted);                    
            });
        }
    });
}