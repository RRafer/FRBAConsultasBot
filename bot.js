const TelegramBot = require('node-telegram-bot-api');
const linksUtils = require('./utils/links');
const adminUtils = require('./utils/admin');
const mongo = require('./utils/mongo');
const config = require('./utils/config');
const onText = require('./utils/onText/onText');
const bot = new TelegramBot(config.token, { polling: true });
let savedMsg = [];
var idPhoto = [];
var idChatPhoto = [];
var stickerChat = [];
// Objeto con permisos. Es una negrada esto.

// Muestra errores en consola
bot.on('polling_error', msg => console.log(msg));

// Elimina mensajes de personas que se unen y abandonan el grupo
bot.on('message', msg => {
  if (msg.new_chat_member !== undefined || msg.left_chat_member !== undefined) {
    bot.deleteMessage(msg.chat.id, msg.message_id);
  }
});

// Verificación usuarios
bot.on('message', adminUtils.validateUser(bot));

// Envia links de grupos y otros
bot.onText(/^\/links/, linksUtils.sendLinks(bot));

bot.onText(/^\/validar/, adminUtils.validateUser(bot));

bot.onText(/^\/catedra/, msg => {
  var chatPos = idChatPhoto.indexOf(msg.chat.id);
    if(chatPos === -1)
    {
        bot.sendPhoto(msg.chat.id, 'AgADAQADEagxG_BImEVSfV4Gc0JIbXLqCjAABFlZxFZk81qhMjcDAAEC').then((auxid) => {
          setTimeout(() => {
              borrarchat = idChatPhoto.indexOf(auxid.chat.id);
              idChatPhoto.splice(borrarchat, 1);
              idPhoto.splice(borrarchat, 1)
          }, 60000);
          idChatPhoto.push(auxid.chat.id);
          idPhoto.push(auxid.message_id);
        });
    }
    else
    {
        bot.sendMessage(idChatPhoto[chatPos], "Has solicitado el comando muy pronto. Aqui tienes la ultima vez que el comando ha sido usado", {reply_to_message_id: idPhoto[chatPos]});
    }
});

bot.onText(/^\/sticker/, (msg) => {
  if(msg.chat.id === -1001214086516){
      var posChat = stickerChat.indexOf(msg.from.id);
      var stickerId = msg.from.id;
      if(posChat === -1){
          if(Math.random() >= 0.5){
              bot.sendMessage(msg.chat.id, 'Cagaste bro, te re cagamo\' lo\' sticker');
              bot.restrictChatMember(msg.chat.id, stickerId, {
                  can_send_message: true,
                  can_send_media_messages: true,
                  can_send_other_messages: false,
                  can_add_web_page_previews: false,
              }).then(() => {
                  setTimeout(() => {
                      stickerChat.splice(posChat, 1);
                  }, 432000000);
                  stickerChat.push(stickerId);
              })
          }
          else{
              bot.sendMessage(msg.chat.id, 'Nos cagaste.\nTe devolvimos los permisos loro');
              bot.promoteChatMember(msg.chat.id, stickerId, {
                  can_send_message: true,
                  can_send_media_messages: true,
                  can_send_other_messages: true,
                  can_add_web_page_previews: true,
              });
          }
      }
      else{
          bot.sendMessage(msg.chat.id, 'No puedes utilizar este comando hasta dentro de 12hs despues de haber utilizado el comando')
      }
  }
  else{
    bot.deleteMessage(msg.chat.id, msg.message_id);
    var deleteMsg = bot.sendMessage(msg.chat.id, 'No puede realizar la acción en este grupo\n\nEste mensaje se borrara en unos instantes').then((deleteMsg) => {
      setTimeout(() => {
        bot.deleteMessage(deleteMsg.chat.id, deleteMsg.message_id);
      }, 10000);
    });
  }
});

bot.on('callback_query', (accionboton) => {
  const accion = accionboton.data.split('@')[0];
  if (accion === 'verificarbot') {
    const userId = accionboton.data.split('@')[1];
    const msgId = accionboton.data.split('@')[2];
    // console.log(`${accionboton.data}`);
    // console.log(`user: ${userId}msg: ${msgId}`);
    // console.log(`chatinstance: ${accionboton.chat_instance}`);
    if (userId == accionboton.from.id) {
      bot.promoteChatMember(accionboton.chat_instance, userId, adminUtils.GivePerms);
      bot.editMessageText('¡Has sido verificado! \u2705\n\nEste mensaje se borrara en unos segundos', {
        chat_id: accionboton.chat_instance,
        message_id: savedMsg.pop(),
      }).then((data) => {
        setTimeout(() => {
          bot.deleteMessage(data.chat.id, data.message_id);
        }, 10000);
      });
    } else {
      bot.answerCallbackQuery({
        callback_query_id: accionboton.id,
        text: 'No puede verificar por otro usuario',
        show_alert: true,
      });
    }
  }
});

// bot.on('new_member', (msg) => {
//   console.log(`Nuevo usuario: ${msg.from.id}`);
//   bot.restrictChatMember(msg.chat.id, msg.from.id, adminUtils.RemPerms);
//   bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}  bienvenido al grupo de consultas ${msg.chat.title} de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.\nEste mensaje se eliminara en 30 segundos`, { reply_markup: JSON.stringify(adminUtils.verify(msg)) }).then((sentMsg) => {
//     savedMsg.push(sentMsg.message_id);
//     // console.log(`savedMsg: ${sentMsg.message_id}`);
//     setTimeout(() => {
//       bot.deleteMessage(msg.chat.id, sentMsg.message_id);
//       // Kick Only (El unban tiene que estar, si no no pueden volver a unirse)
//       bot.kickChatMember(msg.chat.id, msg.from.id);
//       bot.unbanChatMember(msg.chat.id, msg.from.id);
//     }, 30000);
//   });
// });

// Testing
bot.onText(/^\/newmember/, msg => {
  bot.emit('new_member', msg);
});

//Para implementar en newmember cuando funque bien.
bot.onText(/^\/prueba/, msg => {  
  mongo.insertChatId(msg.from.id, msg.chat.id).catch(error =>  mongo.logError(msg.chat.id, error));   
});

bot.onText(/^\/(ban|kick)( .*)?/, (msg, match) => onText.banKick(bot, msg, match));

bot.onText(/^\/remindme [0-9]+ (d|h|m|s|w)( .*)?/, (msg, match) => onText.remindme(bot, msg, match));

bot.onText(/^\/start/, msg => {
  if(msg.chat.type == 'private')
  {
    onText.start(bot, msg);
  }
});

bot.onText(/^\/banall/, msg => onText.banall(bot, msg));

bot.onText(/^\/help/, msg => onText.help(bot, msg));
//#region Comentarios

//Útil pero no debe exponerse.
// bot.onText(/^\/id/, (msg) => {
//   bot.deleteMessage(msg.chat.id, msg.message_id);
//   bot.sendMessage(msg.chat.id, 'ID del chat: ' + msg.chat.id);
// });

//Para registrar a todos una vez implementado el bot.
// bot.onText(/^\/.*/, msg => {
//   mongo.insertChatId(msg.from.id, msg.chat.id).catch(err => {
//     mongo.logError(msg.chat.id, err);
//   });
// });

// Estadisticas
// bot.onText(/[\s\S]+/g, mongo.insertMessage);


// Responde cuando aparece una palabra en un mensaje
/* main.on('message', (msg) => {
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

//Para implementar los comienzos de cuatrimestre.
// bot.onText(/^\/empieza/, (msg) => {
//   bot.deleteMessage(msg.chat.id, msg.message_id);
//   bot.sendMessage(msg.chat.id, 'Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n', { reply_to_message_id: msg.message_id });
// });

//#endregion

