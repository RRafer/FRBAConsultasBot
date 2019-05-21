const TelegramBot = require('node-telegram-bot-api');
const linksUtils = require('./utils/links');
const adminUtils = require('./utils/admin');
const ms = require("ms");
// const mongoUtils = require('./utils/mongo');
const config = require('./utils/config');

const bot = new TelegramBot(config.token, { polling: true });
let savedMsg = [];
// Objeto con permisos. Es una negrada esto.

// Muestra errores en consola
//bot.on('polling_error', msg => console.log(msg));

// Elimina mensajes de personas que se unen y abandonan el grupo
bot.on('message', (msg) => {
  if (msg.new_chat_member !== undefined || msg.left_chat_member !== undefined) {
    bot.deleteMessage(msg.chat.id, msg.message_id);
  }
});

// Verificación usuarios
bot.on('message', adminUtils.validateUser(bot));

// Envia links de grupos y otros
bot.onText(/^\/links/, linksUtils.sendLinks(bot));

bot.onText(/^\/validar/, adminUtils.validateUser(bot));

bot.onText(/^\/catedra/, (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendPhoto(msg.chat.id, 'AgADAQADEagxG_BImEVSfV4Gc0JIbXLqCjAABFlZxFZk81qhMjcDAAEC');
});

// Envia mensaje con el comando /empieza (Solo cuando esta eso en un mensaje)
bot.onText(/^\/empieza/, (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, 'Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n', { reply_to_message_id: msg.message_id });
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

bot.on('new_member', (msg) => {
//   console.log(`Nuevo usuario: ${msg.from.id}`);
  bot.sendMessage(msg.chat.id, `(TEST) Hola ${msg.from.first_name}  bienvenido al grupo de consultas ${msg.chat.title} de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.\nEste mensaje se eliminara en 30 segundos`, { reply_markup: JSON.stringify(adminUtils.verify(msg)) }).then((sentMsg) => {
    savedMsg.push(sentMsg.message_id);
    // console.log(`savedMsg: ${sentMsg.message_id}`);
    setTimeout(() => {
      bot.deleteMessage(msg.chat.id, sentMsg.message_id);
      // Kick Only (El unban tiene que estar, si no no pueden volver a unirse)
      bot.kickChatMember(msg.chat.id, msg.from.id);
      bot.unbanChatMember(msg.chat.id, msg.from.id);
    }, 30000);
  });
});

// Testing
bot.onText(/^\/newmember/, (msg) => {
  bot.emit('new_member', msg);
});

bot.onText(/^\/ban(.*)/, function(msg, match){

  var chatId = msg.chat.id;
  var userId = msg.from.id;
  var replyId = msg.reply_to_message.from.id;
  var replyName = msg.reply_to_message.from.first_name;
  var fromName = msg.from.first_name;
  var numberOfSeconds = match[1]; 

  if (msg.reply_to_message == undefined){
      return;
  }
  
  bot.getChatMember(chatId, replyId).then(replyMember => {
    if(replyMember.user.username != 'frbaconsultas_bot')
    {
      bot.getChatMember(chatId, userId).then(userMember => {
        // if(userMember.user.id != replyMember.user.id)
        // {
          if(userMember.status == 'creator' || userMember.status == 'administrator')
          {
            if(!(replyMember.status == 'creator') || (replyMember.status == 'administrator')){
              if(numberOfSeconds == '' || isNaN(numberOfSeconds))
              {
                bot.kickChatMember(chatId, replyId).then(() => {
                  bot.sendMessage(chatId, "El usuario " + replyName + " ha sido baneado indefinidamente.");
                });
              }
              else
              {
                bot.kickChatMember(chatId, replyId, {until_date: Math.round((Date.now() + ms(numberOfSeconds + " seconds"))/1000)}).then(() => {
                  bot.sendMessage(chatId, "El usuario " + replyName + " ha sido baneado durante " + numberOfSeconds + " segundos.");
                });
              }
            }            
            // else 
            // {
            //   bot.sendMessage(chatId, "Sory " + fromName + " pero no podes banear admins.");
            // }
          }
          else
          {
            bot.sendMessage(chatId, "Sory " + fromName + " pero no sos admin.");
          }
        // }
        // else
        // {
        //   bot.sendMessage(chatId, "Sory " + fromName + " pero no podes auto-echarte.")
        // } 
        
      })
    }
    else
    {
      bot.sendMessage(chatId, "Sory " + fromName + " pero el bot no se puede auto-echar.")
    }
  });
});

// bot.onText(/^\/ban(@[a-zA-Z0-9\.\-\_]*)*/, (msg) => {
//     if(msg.reply_to_message)
//     {
//         bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id, {until_date: Math.round((Date.now() + ms(text + " days"))/1000)}).then(result => {
//           bot.sendMessage(msg.chat.id, "El usuario " + replyName + " ha sido baneado durante " + text + " días.")
//         });
//         // var topDate = Date.now() + 60000;
//         // bot.kickChatMember(msg.chat.id, msg.reply_to_message.from.id, {
//         //     until_date: topDate,
//         // });

//     }
//     // else
//     // {
//         //var userIds = msg.entities.filter(x => x.user != undefined).map(x => x.user.id);
//         //userIds.forEach(userId => bot.kickChatMember(msg.chat.id, userId));
//     // }
// });

// Estadisticas
// bot.onText(/[\s\S]+/g, mongoUtils.insertMessage);


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
