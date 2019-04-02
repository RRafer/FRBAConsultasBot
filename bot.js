const TelegramBot = require('node-telegram-bot-api');
const token = '883966977:AAEKL2FShenvXov-h33BKDqikS8_BD0ft-Q';
const bot = new TelegramBot(token, {polling: true});

const linksUtils = require('./utils/links');
const adminUtils = require('./utils/admin');
const mongoUtils = require('./utils/mongo');




//TOKEN Bot

//Muestra errores en consola
bot.on("polling_error", (msg) => console.log(msg));

// Elimina mensajes de personas que se unen y abandonan el grupo
bot.on('message', (msg) => {
    if(msg.new_chat_member !== undefined || msg.left_chat_member !== undefined){
        setTimeout(() => { bot.deleteMessage(msg.chat.id, msg.message_id); }, 1500);
    }
});


//Envia mensaje con el comando /empieza (Solo cuando esta eso en un mensaje)
bot.onText(/^\/empieza/, (msg) => {
	//console.log(msg);
    bot.sendMessage(msg.chat.id, "Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n",{reply_to_message_id: msg.message_id});
});




bot.onText(/[\s\S]+/g,mongoUtils.insertMessage);

/*main.onText(/^\/stadistics/, (msg) => {

    mongo.connect(url, (err, client) => {

        const db = client.db('BotTelegram');

        db.collection("messages").find({"chat.id":msg.chat.id,"from.id":msg.from.id}).count((err, count) =>{
            if (err) {
                throw err;

                client.close();
            }

            main.sendMessage(msg.chat.id, "Mensajes enviados: " +(count-1),
                {reply_to_message_id: msg.message_id});
        })
    });
});
*/

//Envia links de grupos y otros
bot.onText(/^\/links/,linksUtils.sendLinks(bot));




//Verificación usuarios
bot.on('message', adminUtils.validateUser(bot));
 


// Responde cuando aparece una palabra en un mensaje
/*main.on('message', (msg) => {
	var cmd1 = "/palabra1";
	var cmd2 = "/palabra2";
	var cmd3 = "/palabra3";
 	if (msg.text.includes(cmd1)) {
    	main.sendMessage(msg.chat.id, "Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n");
 	}
 	if (msg.text.includes(cmd2)) {
    	main.sendMessage(msg.chat.id, "");
 	}
 	if (msg.text.includes(cmd3)) {
    	main.sendMessage(msg.chat.id, "");
 	}
}); */
