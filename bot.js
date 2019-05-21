const TelegramBot = require('node-telegram-bot-api');
const linksUtils = require('./utils/links');
const adminUtils = require('./utils/admin');
const mongoUtils = require('./utils/mongo');
const config = require('./utils/config');

const bot = new TelegramBot(config.token, { polling: true });
let savedMsg = [];
var idPhoto = [];
var idChatPhoto = [];
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

bot.onText(/^\/catedra/, (msg) => {
  var chatPos = idChatPhoto.indexOf(msg.chat.id);
  if(chatPos === -1){
    var auxid = bot.sendPhoto(msg.chat.id, 'AgADAQADEagxG_BImEVSfV4Gc0JIbXLqCjAABFlZxFZk81qhMjcDAAEC').then((auxid) => {
      setTimeout(() => {
        borrarchat = idChatPhoto.indexOf(auxid.chat.id);
        idChatPhoto.splice(borrarchat, 1);
        idPhoto.splice(borrarchat, 1)
      }, 60000);
      idChatPhoto.push(auxid.chat.id);
      idPhoto.push(auxid.message_id)
    });
  }
  else {
    bot.sendMessage(idChatPhoto[chatPos], "Has solicitado el comando muy pronto. Aqui tienes la ultima vez que el comando ha sido usado", {reply_to_message_id: idPhoto[chatPos]});
  }
});

bot.onText(/^\/help/, msg => {
  msgChatId = msg.chat.id;
  msgId = msg.message_id;
  mongoUtils.getPrivateChatId(msg.from.id).then(chatId => {  
    bot.sendMessage(chatId, 'Mirá, por ahora tengo\n/catedra - _Te paso una imagen de los horarios de cátedra._\n/links - _Te paso un menú re piola para que obtengas los links que necesitas._\n/remindme *<cantidad de tiempo> <unidad de tiempo en inglés> <mensaje> [opcional]* - _Te hago recordar algo después de una cantidad de tiempo, según la unidad. Si me mandás mensaje, te hago recordar el mensaje. Sino, te hago recordar el mensaje que estés respondiendo. Si no me mandás mensaje ni respondés alguno, te mando un recordatorio genérico._', {parse_mode: 'markdown'});
  }).catch(() => {
    bot.sendMessage(msgChatId, 'Tenés que iniciarme por privado con /start.', {reply_to_message_id: msgId});
  });
});

bot.onText(/^\/id/, (msg) => {
  bot.deleteMessage(msg.chat.id, msg.message_id);
  bot.sendMessage(msg.chat.id, 'ID del chat: ' + msg.chat.id);
});

bot.onText(/^\/sticker/, (msg) => {
  var stickerId = msg.from.id;
  if(msg.chat.id === -1001214086516){
    var r1 = Math.random();
    console.log("Valor R1: " + r1);
    if(r1 >= 0.5){
      bot.sendMessage(msg.chat.id, 'Te salvaste, no te sacamos los stickers.\n\nPor ahora...').then((BorrarMensaje) => {
        setTimeout(() => {
          bot.deleteMessage(random.chat.id, random.message_id);
        }, 30000);
      });
    }
    else{
      bot.deleteMessage(msg.chat.id, msg.message_id);
      bot.sendMessage(msg.chat.id, 'Nv perro, te sacamo lo\' sticker loro').then((BorrarMensaje) => {
        setTimeout(() => {
          bot.deleteMessage(BorrarMensaje.chat.id, BorrarMensaje.message_id);
        }, 30000);
      });
      bot.restrictChatMember(msg.chat.id, stickerId, {perms: {
        can_send_message: true,
        can_send_media_messages: true,
        can_send_other_messages: false}}).then((QuitarSticker) => {
        setTimeout(() => {
          bot.promoteChatMember(QuitarSticker.chat.id, stickerId, {perms: {
            can_send_message: true,
            can_send_media_messages: true,
            can_send_other_messages: true}});
        }, 30000);
      });
    }
  }
  else{
    bot.deleteMessage(msg.chat.id, msg.message_id);
    bot.sendMessage(msg.chat.id, 'No puede realizar la acción en este grupo\n\nEste mensaje se borrara en unos instantes').then((NoChat) => {
      setTimeout(() => {
        bot.deleteMessage(NoChat.chat.id, NoChat.message_id);
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

bot.on('new_member', (msg) => {
  console.log(`Nuevo usuario: ${msg.from.id}`);
  bot.restrictChatMember(msg.chat.id, msg.from.id, adminUtils.RemPerms);
  bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}  bienvenido al grupo de consultas ${msg.chat.title} de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.\nEste mensaje se eliminara en 30 segundos`, { reply_markup: JSON.stringify(adminUtils.verify(msg)) }).then((sentMsg) => {
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
bot.onText(/^\/newmember/, msg => {
  bot.emit('new_member', msg);
});

bot.onText(/^\/(ban|kick)(.*)/, (msg, match) => {
  if(msg.reply_to_message == undefined)
  {
    return;
  }

  var chatId = msg.chat.id;
  var userId = msg.from.id;
  var replyId = msg.reply_to_message.from.id;
  var replyName = msg.reply_to_message.from.first_name + ' ' + (msg.reply_to_message.from.last_name != undefined ? msg.reply_to_message.from.last_name : '');
  var replyUsername = msg.reply_to_message.from.username;
  var fromName = msg.from.first_name + ' ' + (msg.from.last_name != undefined ? msg.from.last_name : '');
  var fromUsername = msg.from.username;  
  var banOrKick = match[1];
  var numberOfSeconds = match[2];
  numberOfSeconds.replace(' ', '');

  if (replyUsername == 'frbaconsultas_bot'){
    return;
  }  

  bot.getChatMember(chatId, replyId).then(replyMember => {
    switch(replyMember.status)
    {
      case 'kicked':
      case 'left':
      case 'creator':
      case 'administrator':
        return;
    }

    bot.getChatMember(chatId, userId).then(userMember => {
      switch(userMember.status)
      {
        case 'creator':
        case 'administrator':
          switch (banOrKick)
          {
            case 'ban':
              if(numberOfSeconds == '' || isNaN(numberOfSeconds))
              {
                bot.kickChatMember(chatId, replyId).then(() => {
                  bot.sendMessage(chatId, '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')'  + " ha baneado a [" + (replyUsername != undefined ? '@' + replyUsername : replyName) + '](tg://user?id=' + replyId + ')' + " indefinidamente!", { parse_mode: 'Markdown' });
                });
              }
              else
              {
                bot.kickChatMember(chatId, replyId, {until_date: Math.round((Date.now() + (parseInt(numberOfSeconds) * 1000)) / 1000)}).then(() => {
                  bot.sendMessage(chatId, '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')' + " ha baneado a [" + (replyUsername != undefined ? '@' + replyUsername : replyName) + '](tg://user?id=' + replyId + ')' + "  durante " + numberOfSeconds + " segundos!", { parse_mode: 'Markdown' });
                });
              }
              break;
            case 'kick':
              bot.kickChatMember(chatId, replyId).then(() => {
                bot.unbanChatMember(chatId, replyId);                  
                bot.sendMessage(chatId, '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')' + ' ha kickeado a ' + '[' + (replyUsername != undefined ? '@' + replyUsername : replyName) + '](tg://user?id=' + replyId + ')', { parse_mode: 'Markdown' });
              });
              break;
          }
          break;
        default:
          bot.sendMessage(chatId, "Sory" + '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')' + " pero no sos admin.", { parse_mode: 'Markdown' });
          break;
      }
    });
  });
  
});

bot.onText(/^\/remindme [0-9]+ (days|day|hours|hour|minutes|minute|seconds|second|weeks|week)(.*)/, (msg, match) => {
  var chatId = msg.chat.id;
  var userId = msg.from.id;
  var fromUsername = msg.from.username;
  var fromName = msg.from.first_name + ' ' + msg.from.last_name;
  var replyMessageId = msg.reply_to_message != undefined ? msg.reply_to_message.message_id : null;
  var messageId = msg.message_id;
  var typeOfUnit = match[1];
  var textToRemember = match[2];
  var amount = parseInt(match[0].substring(10, match[0].indexOf(typeOfUnit)));
  var timeToSet = 0;
  var spanishTypeOfUnit = '';
  
  //Esto es un asco, se modificará en breve.
  //Javascript te odio.
  //Todos putos.
  switch(typeOfUnit)
  {
    case 'days':
      timeToSet = amount * 24 * 60 * 60;
      spanishTypeOfUnit = 'días';
      break;
    case 'day':
      timeToSet = amount * 24 * 60 * 60;
      spanishTypeOfUnit = 'día';
      break;
    case 'hours':
      timeToSet = amount * 60 * 60;
      spanishTypeOfUnit = 'horas';
      break;
    case 'hour':
      timeToSet = amount * 60 * 60;
      spanishTypeOfUnit = 'hora';
      break;
    case 'minutes':
      timeToSet = amount * 60;
      spanishTypeOfUnit = 'minutos';
      break;
    case 'minute':
      timeToSet = amount * 60;
      spanishTypeOfUnit = 'minuto';
      break;
    case 'seconds':
      timeToSet = amount;
      spanishTypeOfUnit = 'segundos';
      break;
    case 'second':
      timeToSet = amount;
      spanishTypeOfUnit = 'segundo';
      break;
    case 'weeks':
      timeToSet = amount * 7 * 24 * 60 * 60;
      spanishTypeOfUnit = 'semanas';
      break;
    case 'week':
      timeToSet = amount * 7 * 24 * 60 * 60;
      spanishTypeOfUnit = 'semana';
      break;
  }

  bot.sendMessage(chatId, 'Te voy a recordar dentro de ' + amount + ' ' + spanishTypeOfUnit + ' ' + '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')' + '!', { parse_mode: 'Markdown' });
  
  var counter = 0;

  setInterval(() => {
    counter++;

    if(counter == timeToSet)
    {
      bot.getChatMember(chatId, userId).then(member => {
        switch(member.status)
        {
        case 'kicked':
        case 'left':
          return;
        }

        var mention = '[' + (fromUsername != undefined ? '@' + fromUsername : fromName) + '](tg://user?id=' + userId + ')';
        var message = '';

        if(replyMessageId != null)
        {
          message = 'Te recuerdo ' + mention + '!';
          bot.sendMessage(chatId, message, {reply_to_message_id: replyMessageId, parse_mode: 'Markdown'}).catch(() => {
            return;
          });
        }
        else
        {
          if(textToRemember == undefined || textToRemember == ' ')
          {
            message = 'Te recuerdo' + mention + '!';
          }
          else
          {
            message = 'Te recuerdo' + textToRemember + ' ' + mention + '!';
          }

          bot.sendMessage(chatId, message, {parse_mode: 'Markdown'}).catch(() => {
            return;
          });
        }
      });
    }
  }, 1000);
});

bot.onText(/^\/start/, msg => {
  var userId = msg.from.id;
  var chatId = msg.chat.id;

  mongoUtils.hasStarted(userId).then(res => {
    if(res)
    {
      bot.sendMessage(chatId, 'Utillza /help para ver todos los comandos disponibles.');      
    }
    else
    {
      mongoUtils.insertUser(userId, chatId).then(() => {
        bot.sendMessage(chatId, 'Bienvenido!\nUtillza /help para ver todos los comandos disponibles.');
      }).catch(() => {
        bot.sendMessage(chatId, 'Hubo un error. Por favor, mandame /start en unos minutos.');
      });
    }
  }).catch(() => {
    bot.sendMessage(chatId, 'Hubo un error. Por favor, mandame /start en unos minutos.');
  });
});

//#region Comentarios
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

//Para implementar los comienzos de cuatrimestre.
// bot.onText(/^\/empieza/, (msg) => {
//   bot.deleteMessage(msg.chat.id, msg.message_id);
//   bot.sendMessage(msg.chat.id, 'Las materias de 2do a 6to año empiezan el 18\nFisica 1 curso Z empieza el 25\nRecursantes empiezan el 25 de marzo\nIngresantes empiezan el 1 de Abril\n', { reply_to_message_id: msg.message_id });
// });

//#endregion


