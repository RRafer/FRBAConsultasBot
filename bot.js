// @ts-check
/* eslint-disable no-console */
// Start the DB before loading config
require('./controllers/database').initDb();
const TelegramBot = require('node-telegram-bot-api');
const mongo = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017';

//TOKEN Bot
const token = '883966977:AAEKL2FShenvXov-h33BKDqikS8_BD0ft-Q';

const bot = new TelegramBot(token, {polling: true});

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

/*
bot.onText(/[\s\S]+/g,(msg) => {

    mongo.connect(url, (err, client) => {


        const db = client.db('BotTelegram');

        db.collection("messages").insertOne(msg, (err, res) => {
            if (err) throw err;

            client.close();

        });
    });
});*/

/*bot.onText(/^\/stadistics/, (msg) => {

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
*/


//Envia links de grupos y otros
bot.onText(/^\/links/, (msg) => {
    var links = {
        "inline_keyboard": [
            [
                {
                    text: "Encuesta Docente",
                    url: "https://docs.google.com/spreadsheets/d/19XPRP8zsVut-W1HihBxSZ_mZHlyHMBy-WIKNqurdNs8/edit?usp=sharing"
                },
                {
                    text: "Calendario académico",
                    url: "http://siga.frba.utn.edu.ar/up/docs/CalendarioAcademico2019.jpg"
                }
            ],
            [
                {
                    text: "UTNianos - Relax (Offtopic)",
                    url: "https://t.me/joinchat/I56Nlks-UO1tfq-oPo1X8g"
                },
                {
                    text: "Novedades UTN",
                    url: "https://t.me/joinchat/AAAAAEYtOAZkHDcubu0kTw"
                }
            ],
            [
                {
                    text: "Ing. Sistemas",
                    callback_data: 1
                },
                {
                    text: "Ing. Electrónica",
                    callback_data: 2
                }
            ],
            [
                {
                    text: "Ing. Industrial",
                    callback_data: 5
                },
                {
                    text: "Ciencias básicas.",
                    callback_data: 3
                }
            ],
            [
                {
                    text: "Ingreso",
                    callback_data: 4
                }
            ]
        ]
    };

    var sistemas = {
        "inline_keyboard": [
            [
                {
                    text: "Consultas",
                    url: "https://t.me/joinchat/I56NlkYz5zSQlGK5pY2z2Q"
                }
            ],
            [
                {
                    text: "Sistemas y Organizaciones",
                    url: "https://t.me/joinchat/I56NllM1zvwWCJm2kjbDJA"
                },
                {
                    text: "Matemática Discreta",
                    url: "https://t.me/joinchat/I56Nlk5RT8WzHvJNxS6SZw"
                }
            ],
            [
                {
                    text: "Algoritmos y Estructura de Datos",
                    url: "https://t.me/joinchat/I56NlksXoCPK6v2gFxRCXA"
                },
                {
                    text: "Arquitectura de Computadoras",
                    url: "https://t.me/joinchat/I56NllGs6dWlkvYmkMnLIw"
                }
            ],
            [
                {
                    text: "Analisis de Sistemas",
                    url: "https://t.me/joinchat/I56NllM1zvwWCJm2kjbDJA"
                },
                {
                    text: "Sintaxis y Semantica de los Lenguajes",
                    url: "https://t.me/joinchat/I56NlhXhclb8iG52KFBpKg"
                }
            ],
            [
                {
                    text: "Paradigmas de Programación",
                    url: "https://t.me/joinchat/I56Nlkyv4xMgJbAJVnwkRw"
                }
            ],
            [
                {
                    text: "Diseño de Sistemas",
                    url: "https://t.me/joinchat/I56NlhNqcghyL5dP7GpwOA"
                },
                {
                    text: "Gestión de Datos",
                    url: "https://t.me/joinchat/I56NlliHAUjG7w1Rxm7vMQ"
                }
            ],
            [
                {
                    text: "Sistemas Operativos",
                    url: "https://t.me/joinchat/I56NlkfCkX-G5wb13H9bVA"
                },
                {
                    text: "Matemática Superior",
                    url: "https://t.me/joinchat/I56NllMgZkgyFQ7pF2AiWA"
                }
            ],
            [
                {
                    text: "Técnicas Avanzadas de Programación",
                    url: "https://t.me/TADPUTN"
                }
            ]
        ]
    };

    var industrial = {
        "inline_keyboard": [
            [
                {
                    text: "Consultas",
                    url: "https://t.me/IndustrialUTN"
                }
            ]
        ]
    };

    var basica = {
        "inline_keyboard": [
            [
                {
                    text: "Análisis Matemático I",
                    url: "https://t.me/AnalisisMatematicoI"
                },
                {
                    text: "Algebra y Geometria Analítica",
                    url: "https://t.me/algebrautnfrba"
                }
            ],
            [
                {
                    text: "Fisica I",
                    url: "https://t.me/FisicaI"
                },
                {
                    text: "Quimica General",
                    url: "https://t.me/joinchat/I56NllKkSXk4klHXY9I2lw"
                }
            ],
            [
                {
                    text: "Análisis Matemático II",
                    url: "https://t.me/AnalisisMatematicoII"
                },
                {
                    text: "Probabilidad y Estadistica",
                    url: "https://t.me/probautn"
                }
            ],
            [
                {
                    text: "Fisica II",
                    url: "https://t.me/joinchat/I56NlkTlE4mRDXeHpmY9XA"
                }
            ]
        ]
    };

    var electronica = {
        "inline_keyboard": [
            [
                {
                    text: "Consultas",
                    url: "https://t.me/joinchat/I56NllK4UcKmSI77brSJvQ"
                }
            ],
            [
                {
                    text: "Informatica I",
                    url: "https://t.me/joinchat/I56NlkXmGlX23GKn7fiZNA"
                }
            ]
        ]
    };

    var ingreso = {
        "inline_keyboard": [
            [
                {
                    text: "Módulo B",
                    url: "https://t.me/ingresoutnfrba"
                }
            ],
            [
                {
                    text: "Módulo A",
                    url: "https://t.me/joinchat/I56Nlk-4xT1jtWiR1_hyCA"
                }
            ]
        ]
    };

    bot.sendMessage(msg.chat.id,"LINKS", {
        "reply_markup": JSON.stringify(links),
        reply_to_message_id: msg.message_id
    });

    var msgLinks = msg.message_id + 1;

    bot.on('callback_query', function onCallbackQuery(link){
        console.log(msgLinks);
        if(link.from.id === link.message.reply_to_message.from.id){
            switch(link.data){
                //Sistemas
                case '1':
                    var messages = "Links de Ing. Sistemas";
                    bot.editMessageText(messages, {
                        chat_id: msg.chat.id,
                        message_id: msgLinks,
                        "reply_markup": JSON.stringify(sistemas)
                    });
                    break;
                //Electronica
                case '2':
                    var messageel = 'Links de Ing. Electrónica: ';

                    bot.editMessageText(messageel, {
                        chat_id: msg.chat.id,
                        message_id: msgLinks,
                        "reply_markup": JSON.stringify(electronica)
                    });
                    break;
                //Basicas
                case '3':
                    var messageb = 'Links de Ciencias Basicas: ';

                    bot.editMessageText(messageb, {
                        chat_id: msg.chat.id,
                        message_id: msglinks,
                        "reply_markup": JSON.stringify(basica)
                    });
                    break;
                //Ingreso
                case '4':
                    var messageing = 'Links de Ingreso: ';

                    bot.editMessageText(messageing, {
                        chat_id: msg.chat.id,
                        message_id: msgLinks,
                        "reply_markup": JSON.stringify(ingreso)
                    });
                    break;
                //Industrial
                case '5':
                    var messageind = 'Links de Ing. Industrial: ';

                    bot.editMessageText(messageind, {
                        chat_id: msg.chat.id,
                        message_id: msgLinks,
                        "reply_markup": JSON.stringify(industrial)
                    });
                    break;
                default:
                    break;
            }
        }
        else{
            bot.answerCallbackQuery({
                callback_query_id: link.id,
                text: "No puede verificar por otro usuario",
                show_alert: true
            });
        }
    })
});




//Verificación usuarios
bot.on('message', function(msg){
    var verify = {
            "inline_keyboard": [
                [
                    {text: "Haga clic aquí", callback_data: 'verificarbot'}
                ]
            ]
        };
 
    const RemPerms = {
	    perms:can_send_message = false,
	    perms:can_send_media_messages = false,
	    perms:can_send_other_messages = false,
	    perms:can_add_web_page_previews = false
	};

    const GivePerms = {
	    perms:can_send_message = true,
	    perms:can_send_media_messages = true,
	    perms:can_send_other_messages = true,
	    perms:can_add_web_page_previews = true
	};

    var userId;
    var msgBienvenida;

    if (msg.new_chat_members !== undefined){
        userId = msg.new_chat_members[0].id;
        bot.restrictChatMember(msg.chat.id, userId, RemPerms).then(function(result){
            bot.sendMessage(msg.chat.id, "Hola " + msg.new_chat_members[0].first_name + ", bienvenido al grupo de consultas " + msg.chat.title + " de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.", {"reply_markup": JSON.stringify(verify)});
            msgBienvenida = msg.message_id + 1;
        })
    }

    bot.on('callback_query', function onCallbackQuery(accionboton){
	   	console.log(accionboton);

	    if (accionboton.data === 'verificarbot'){
            if(userId === accionboton.from.id){
                bot.promoteChatMember(msg.chat.id, userId, GivePerms);
                bot.editMessageText("¡Has sido verificado! \u2705\n\nEste mensaje se borrara en unos segundos",{chat_id: msg.chat.id, message_id: msgBienvenida}).then(function (data){
                    setTimeout(function(){
                        bot.deleteMessage(data.chat.id, data.message_id);
                    }, 10000);
                })
            }
            else{
                bot.answerCallbackQuery({
                    callback_query_id: accionboton.id,
                    text: "No puede verificar por otro usuario",
                    show_alert: true
                });
            }
	    }
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
