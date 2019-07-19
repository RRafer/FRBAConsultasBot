/* eslint-disable no-console */
const TelegramBot = require('node-telegram-bot-api');
const linksUtils = require('./utils/links');
const adminUtils = require('./utils/admin');
const mongo = require('./utils/mongo');
const { config } = require('./utils/config');
const { token } = require('./utils/token');
const onText = require('./utils/onText/onText');
const latex = require('./utils/onText/latex');
const autismo = require('./utils/onText/autismo');
const rotate = require('./utils/onText/rotate');

const bot = new TelegramBot(token, { polling: true });
const savedMsg = new Map();
// Juro que esto es una negrada, pero no se me ocurre
const savedTimers = new Map();
// let idPhoto = [];
// let idChatPhoto = [];
// let stickerChat = [];
/* const callbackObject = {
  action: '',
  p: [],
};
*/

// Muestra errores en consola
bot.on('polling_error', msg => console.log(msg));

// Elimina mensajes de personas que se unen y abandonan el grupo
bot.on('message', (msg) => {
	if ((config.features[msg.chat.id]
    && config.features[msg.chat.id].enableDeleteSystemMessages)
    || config.features[0].enableDeleteSystemMessages) {
		if (msg.new_chat_member !== undefined || msg.left_chat_member !== undefined) {
			bot.deleteMessage(msg.chat.id, msg.message_id);
		}
	}
});

bot.onText(/^\/rotar (.*)/, (msg, match) => {
	if ((config.features[msg.chat.id]
    && config.features[msg.chat.id].enableRotate)
    || config.features[0].enableRotate) {
		rotate.execute(bot, msg, match);
	}
});

// Verificación usuarios
bot.on('message', (msg) => {
	if ((config.features[msg.chat.id]
    && config.features[msg.chat.id].enableValidateUsers)
    || config.features[0].enableValidateUsers)
		adminUtils.validateUser(bot);
});

// Envia links de grupos y otros
bot.onText(/^\/links/,
	(msg) => {
		if ((config.features[msg.chat.id]
      && config.features[msg.chat.id].enableLinks)
      || config.features[0].enableLinks) {
			linksUtils.sendLinks(bot);
		}
	});

// LMGTFY
bot.onText(/^\/google (.*)/ , (msg, match) => {
  if ((config.features[msg.chat.id] 
       && config.features[msg.chat.id].enableGoogle) 
       || config.features[0].enableGoogle) {
    bot.sendMessage(msg.chat.id, `https://lmgtfy.com/?q=${encodeURIComponent(match[1])}`, {reply_to_message_id: msg.message_id});
  }
});

/*
bot.onText(/^\/catedra/, (msg) => {
  const chatPos = idChatPhoto.indexOf(msg.chat.id);
  if (chatPos === -1) {
    bot.sendPhoto(msg.chat.id, 'AgADAQADbKgxG103QUQeGv8r315mbltxDDAABECS2Sc_YjetEiQFAAEC').then((auxid) => {
      setTimeout(() => {
        borrarchat = idChatPhoto.indexOf(auxid.chat.id);
        idChatPhoto.splice(borrarchat, 1);
        idPhoto.splice(borrarchat, 1);
      }, 60000);
      idChatPhoto.push(auxid.chat.id);
      idPhoto.push(auxid.message_id);
    });
  } else {
    bot.sendMessage(idChatPhoto[chatPos], 'Has solicitado el comando muy pronto. Aqui tienes la ultima vez que el comando ha sido usado', { reply_to_message_id: idPhoto[chatPos] });
  }
});

bot.onText(/^\/sticker/, (msg) => {
  if (msg.chat.id === -1001214086516) {
    const posChat = stickerChat.indexOf(msg.from.id);
    const stickerId = msg.from.id;
    if (posChat === -1) {
      if (Math.random() >= 0.5) {
        bot.sendMessage(msg.chat.id, 'Cagaste bro, te re cagamo\' lo\' sticker');
        bot.restrictChatMember(msg.chat.id, stickerId, {
          can_send_message: true,
          can_send_media_messages: false,
          can_send_other_messages: false,
          can_add_web_page_previews: false,
        }).then(() => {
          setTimeout(() => {
            stickerChat.splice(posChat, 1);
          }, 432000000);
          stickerChat.push(stickerId);
        });
      } else {
        bot.sendMessage(msg.chat.id, 'Nos cagaste.\nTe devolvimos los permisos loro');
        bot.promoteChatMember(msg.chat.id, stickerId, {
          can_send_message: true,
          can_send_media_messages: true,
          can_send_other_messages: true,
          can_add_web_page_previews: true,
        });
      }
    } else {
      bot.sendMessage(msg.chat.id, 'No puedes utilizar este comando hasta dentro de 12hs despues de haber utilizado el comando');
    }
  } else {
    bot.deleteMessage(msg.chat.id, msg.message_id);
    const deleteMsg = bot.sendMessage(msg.chat.id, 'No puede realizar la acción en este grupo\n\nEste mensaje se borrara en unos instantes').then((deleteMsg) => {
      setTimeout(() => {
        bot.deleteMessage(deleteMsg.chat.id, deleteMsg.message_id);
      }, 10000);
    });
  }
});
*/

bot.on('callback_query', (json) => {
	const CBObject = JSON.parse(json.data);
	if (CBObject.action === 'v') {
		// CBObject.p[0] = userId;
		if (parseInt(CBObject.p[0], 10) === json.from.id) {
			bot.promoteChatMember(json.message.chat.id, CBObject.p[0], adminUtils.GivePerms).catch((e) => {
				// Catch obligatorio. Posibles casos de Falla:
				// El usuario es Admin/Creator
				// El usuario se va del chat antes de que el comando sea ejecutado
				console.log(e);
			});
			bot.editMessageText('¡Has sido verificado! \u2705\n\nEste mensaje se borrara en unos segundos', {
				chat_id: json.message.chat.id,
				message_id: savedMsg.get(CBObject.p[0]),
			}).then((data) => {
				setTimeout(() => {
					bot.deleteMessage(data.chat.id, data.message_id);
				}, 10000);
				clearTimeout(savedTimers.get(CBObject.p[0]));
				savedMsg.delete(CBObject.p[0]);
				savedTimers.delete(CBObject.p[0]);
			}).catch((e) => {
				console.log(`Falla al editar mensaje de verificacion ${e}`);
			});
		} else {
			bot.answerCallbackQuery({
				callback_query_id: json.id,
				text: 'No puede verificar por otro usuario',
				show_alert: true,
			});
		}
	}
});


bot.on('new_member', (msg) => {
	if (savedMsg.get(msg.from.id) === undefined) {
		bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}${msg.from.last_name || ''} bienvenido al grupo de consultas ${msg.chat.title} de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.\nEste mensaje se eliminara en 30 segundos`, { reply_markup: JSON.stringify(adminUtils.verify(msg)) }).then((sentMsg) => {
			savedMsg.set(msg.from.id, sentMsg.message_id);
			savedTimers.set(msg.from.id, setTimeout(() => {
				// Borro el mensaje si no verifico
				bot.deleteMessage(msg.chat.id, sentMsg.message_id);
				// Kick Only (El unban tiene que estar, si no no pueden volver a unirse)
				bot.kickChatMember(msg.chat.id, msg.from.id);
				bot.unbanChatMember(msg.chat.id, msg.from.id);
				savedMsg.delete(msg.from.id);
				savedTimers.delete(msg.from.id);
			}, 30000));
		}).catch((e) => {
			console.log(e);
		});
	} else {
		console.log('Intento de verificacion doble.');
	}
});

// Test: funcion Validar
bot.onText(/^\/newmember/, (msg) => {
	bot.emit('new_member', msg);
});

// Para implementar en newmember cuando funque bien.
// bot.onText(/^\/prueba/, msg => mongo.insertChatId(msg.from.id, msg.chat.id));
/*

bot.onText(/^\/(ban|kick)( .*)?/, (msg, match) => onText.banKick(bot, msg, match));

bot.onText(/^\/remindme [0-9]+ (d|h|m|s|w)( .*)?/, (msg, match) => onText.remindme(bot, msg, match));

*/
/* bot.onText(/^\/start/, (msg) => {
  if (msg.chat.type == 'private') {
    onText.start(bot, msg);
  }
});
*/

// bot.onText(/^\/banall/, msg => onText.banall(bot, msg));

// bot.onText(/^\/help/, msg => onText.help(bot, msg));
// #region Comentarios

// Útil pero no debe exponerse.
// bot.onText(/^\/id/, (msg) => {
//   bot.deleteMessage(msg.chat.id, msg.message_id);
//   bot.sendMessage(msg.chat.id, 'ID del chat: ' + msg.chat.id);
// });

// Para registrar a todos una vez implementado el bot.
// bot.onText(/^\/.*/, msg => {
//   mongo.insertChatId(msg.from.id, msg.chat.id).catch(err => {
//     mongo.logError(msg.chat.id, err);
//   });
// });

// Estadisticas
// bot.onText(/[\s\S]+/g, mongo.insertMessage);

/* main.onText(/^\/stadistics/, (msg) => {

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

// Para implementar los comienzos de cuatrimestre.
// bot.onText(/^\/empieza/, (msg) => {
//   bot.deleteMessage(msg.chat.id, msg.message_id);
//   bot.sendMessage(msg.chat.id, 'Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n', { reply_to_message_id: msg.message_id });
// });

// #endregion
