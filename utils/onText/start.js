// const generic = require('../generic');
// const mongo = require('../mongo');

exports.execute = (bot, msg) => {
    return new Promise((resolve, reject) => {
        var userId = msg.from.id;
        var chatId = msg.chat.id;
        const messageIfHasStarted = 'Utillza /help para ver todos los comandos disponibles.';
        const messageWelcome = 'Bienvenido!';
        
        mongo.hasStarted(userId, chatId).then(res => {
            if(res)
            {
                bot.sendMessage(3 + chatId, messageIfHasStarted).then(() => resolve()).catch(err => reject(err));      
            }
            else
            {
                mongo.insertPrivateChat(chatId, userId).then(() => {
                    bot.sendMessage(chatId, messageWelcome + generic.lineBreak + messageIfHasStarted).then(() => resolve()).catch(err => reject(err));                    
                }).catch((err) => reject(err));
            }

        }).catch(err => reject(err));
    });
    
}