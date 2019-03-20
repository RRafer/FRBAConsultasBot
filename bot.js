const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
//TOKEN Bot
const token = '883966977:AAEKL2FShenvXov-h33BKDqikS8_BD0ft-Q';

const bot = new TelegramBot(token, {polling: true});


//Cuando aparece solo esa palabra
bot.onText(/^\/empieza/, (msg) => {
  //console.log(msg);
    bot.sendMessage(msg.chat.id, "Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n",{reply_to_message_id: msg.message_id});
});

// Responde cuando aparece una palabra en un mensaje
/*bot.on('message', (msg) => { 
	var cmd1 = "/palabra1";
	var cmd2 = "/palabra2";
	var cmd3 = "/palabra3";
 	if (msg.text.includes(cmd1)) {
    	bot.sendMessage(msg.chat.id, "Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n");
 	}
 	if (msg.text.includes(cmd2)) {
    	bot.sendMessage(msg.chat.id, "");
 	}
 	if (msg.text.includes(cmd3)) {
    	bot.sendMessage(msg.chat.id, "");
 	}
}); */
