// const generic = require('../generic');
// const mongo = require('../mongo');

exports.execute = (bot, msg) => {
	return new Promise((resolve, reject) => {
		var chatId = msg.chat.id;
		const messageIfHasStarted = 'Utillza /help para ver todos los comandos disponibles.';
		bot.sendMessage(chatId, messageIfHasStarted).then(() => resolve()).catch(error => reject(error));    
	});
};

//#region Comentarios

//var userId = msg.from.id;
//const messageWelcome = 'Bienvenido!';
// mongo.hasStarted(userId, chatId).then(res => {
//     if(res)
//     {
//         bot.sendMessage(chatId, messageIfHasStarted);      
//     }
//     else
//     {
//         mongo.setStartedUser(userId, chatId).then(() => {
//             bot.sendMessage(chatId, messageWelcome + generic.lineBreak + messageIfHasStarted);                    
//         });
//     }
// });

//#endregion
