// @ts-check
/* eslint-disable no-console */
// Start the DB before loading config
require('./controllers/database').initDb();
const TelegramBot = require('node-telegram-bot-api');
const moment = require('moment');
const mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

//TOKEN Bot
const token = '883966977:AAEKL2FShenvXov-h33BKDqikS8_BD0ft-Q';

const bot = new TelegramBot(token, {polling: true});


//Cuando aparece solo esa palabra
bot.onText(/^\/empieza/, (msg) => {
  //console.log(msg);
    bot.sendMessage(msg.chat.id, "Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n",{reply_to_message_id: msg.message_id});
});

bot.onText(/[\s\S]+/g,(msg) => {

    mongo.connect(url, (err, client) => {
        console.log(msg.from.first_name);

        const db = client.db('BotTelegram');

        db.collection("messages").insertOne(msg, (err, res) => {
            if (err) throw err;

            client.close();

        });
    });
});

bot.onText(/^\/stadistics/, (msg) => {

    mongo.connect(url, (err, client) => {

        const db = client.db('BotTelegram');

        db.collection("messages").find({"chat.id":msg.chat.id,"from.id":msg.from.id}).count((err, count) =>{
            if (err) {
                throw err;

                client.close();
            }

            bot.sendMessage(msg.chat.id, "Mensajes enviados: " +(count-1),
                {reply_to_message_id: msg.message_id});
        })
    });
});

bot.on('message', function(msg){
 
    var verify = {
            "inline_keyboard": [
                [
                    {text: "Haga clic aquí", callback_data: 'verificarbot'}
                ]
            ]
        };
 
    var data = {
        "reply_markup": JSON.stringify(verify)
    };
 
    /*const RemPerms = {
	    perms.can_send_message = false,
	    perms.can_send_media_messages = false,
	    perms.can_send_other_messages = false,
	    perms.can_add_web_page_previews = false
	}

	const GivePerms = {
	    perms.can_send_message = true,
	    perms.can_send_media_messages = true,
	    perms.can_send_other_messages = true,
	    perms.can_add_web_page_previews = true
	}*/

    if (msg.new_chat_members != undefined){
    //    bot.restrictChatMember(msg.chat.id, msg.new_chat_members[0].id, RemPerms).then(function(result){
            bot.sendMessage(msg.chat.id, "Hola " + msg.new_chat_members[0].first_name + ", bienvenido al grupo de consultas " + msg.chat.title + " de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.", data);
    		
    		const msgBienvenida = msg.message_id;
		 	console.log(msgBienvenida)
		 	console.log(msg.new_chat_members[0].id)
    //   })
    }

    bot.on('callback_query', function onCallbackQuery(accionboton){
	    const data = accionboton.data
	    const msg = accionboton.message
	   	console.log(accionboton)

	    if (data == "verificarbot"){
	    //    bot.restrictChatMember(msg.chat.id, msg.new_chat_members[0].id, perms).then(function(result){
	            bot.editMessageText(msg.chat.id, msgBienvenida, msg.new_chat_members[0].first_name + " ¡Has sido verificado \u2705!\n\nEste mensaje se borrara en unos minutos")//.then(function (data){
				/*    setTimeout(function(){
				        bot.deleteMessage(data.chat.id, data.message_id);
				    }, 60000);
				}*/
	    //  })
	    };
	})	
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
