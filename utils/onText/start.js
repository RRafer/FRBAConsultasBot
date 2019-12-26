// const generic = require('../generic');
// const mongo = require('../mongo');

exports.execute = (bot, msg) => {
    return new Promise((resolve, reject) => {
        var chatId = msg.chat.id;
        const messageIfHasStarted = 'Utillza /help para ver todos los comandos disponibles.';
        bot.sendMessage(chatId, messageIfHasStarted).then(() => resolve()).catch(error => reject(error));    
    });
}


        }).catch(err => reject(err));
    });
    
}