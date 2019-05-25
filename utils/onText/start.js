const generic = require('../generic');

exports.execute = (bot, msg, mongo) => {
    var userId = msg.from.id;
    var chatId = msg.chat.id;
    const messageIfHasStarted = 'Utillza /help para ver todos los comandos disponibles.';
    const messageWelcome = 'Bienvenido!';
    const messageError = 'Hubo un error. Por favor, mandame /start en unos minutos.';
    
    mongo.hasStarted(userId).then(res => {
        if(res)
        {
            bot.sendMessage(chatId, messageIfHasStarted);      
        }
        else
        {
            mongo.insertUser(userId, chatId).then(() => {
                bot.sendMessage(chatId, messageWelcome + generic.lineBreak + messageIfHasStarted);
            }).catch(() => {
                bot.sendMessage(chatId, messageError);
            });
        }
    }).catch(() => {
        bot.sendMessage(chatId, messageError);
    });
}