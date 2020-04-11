// @ts-check

// Start the DB before loading config
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const databaseController = require('./controllers/database');
const privateController = require('./controllers/private');
const logger = require('./utils/logger');
const linksController = require('./controllers/links');
const adminControllers = require('./controllers/admin');
const nuke = require('./controllers/nuke');
const denuke = require('./controllers/denuke');
const excel = require('./controllers/excel');
const utils = require('./utils/generic');

const UserService = require('./services/user');

const config = require('./utils/config');
const rotate = require('./utils/onText/rotate');

databaseController.initDb();

logger.info('Starting Bot');
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
logger.info('Bot Started');

// Juro que esto es una negrada, pero no se me ocurre
const savedMsg = new Map();
const savedTimers = new Map();

UserService.getSavedUsersCount().then((tsc)=>{
  console.info(`DB loaded ${tsc} Users`);
});

/* const callbackObject = {
  action: '',
  p: [],
};
*/

// Muestra errores en consola
bot.on('polling_error', msg => console.log(msg));

bot.on('message', (msg) => {
  // User verification (to prevent bots)
  if(config.isEnabledFor('enableValidateUsers', msg.chat.id) && (msg.new_chat_members !== undefined)){
    bot.emit('new_member', msg);
  }
  
  // Deletes messages from peoplo Joining/Leaving the group
  if (config.isEnabledFor('enableDeleteSystemMessages', msg.chat.id) && 
  (msg.new_chat_members !== undefined || msg.left_chat_member !== undefined)){
    // I have to work this over
    bot.deleteMessage(msg.chat.id, String(msg.message_id)).catch(e =>{
      logger.error(`Error deleting message: ${e}`);
    });
  }
  
  // Save user into DB
  if(msg.from.username) 
    UserService.saveUser(msg.from.id, msg.from.username);
});

bot.onText(/^\/rotar (.+)/, (msg, match) => {
  if (config.isEnabledFor('enableRotate', msg.chat.id)) 
    rotate.execute(bot, msg, match);
});

// Sends group links (TODO: Refactor later)
bot.onText(/^\/links/, async (msg) => {
  if (config.isEnabledFor('enableLinks', msg.chat.id)) 
    linksController.sendLinks(bot, msg);	
});

// Nuking users from All groups
bot.onText(/^\/nuke/,(msg) => {
  if (config.isEnabledFor('enableNuke', msg.chat.id))
    nuke.nuke(bot, msg);
});

// De nuking users
bot.onText(/^\/denuke/,(msg) => {
  if (config.isEnabledFor('enableNuke', msg.chat.id)) 
    denuke.denuke(bot, msg);
});


// LMGTFY
bot.onText(/^\/google (.+)/ , (msg, match) => {
  if (config.isEnabledFor('enableGoogle', msg.chat.id)) 
    bot.sendMessage(msg.chat.id, `https://lmgtfy.com/?q=${encodeURIComponent(match[1])}`, {reply_to_message_id: msg.message_id});
});

// Sends a link that's always requested.
bot.onText(/^\/excel/, msg => {
  if(config.isEnabledFor('enableExcel', msg.chat.id))
    excel.excel(bot, msg);
});

// Private greeting.
bot.onText(/^\/start/, (msg) => {
  privateController.start(bot, msg);
});

// TODO: Refactor for userValidation
bot.on('callback_query', (json) => {
  const CBObject = JSON.parse(json.data);
  if (CBObject.action === 'v') {
    // CBObject.p[0] = userId;
    if (parseInt(CBObject.p[0], 10) === json.from.id) {
      bot.promoteChatMember(json.message.chat.id, CBObject.p[0], adminControllers.GivePerms).catch((e) => {
        // Catch obligatorio. Posibles casos de Falla:
        // El usuario es Admin/Creator
        // El usuario se va del chat antes de que el comando sea ejecutado
        logger.error(`Error promoting chat member: ${e}`);
      });
      bot.editMessageText('¡Has sido verificado! \u2705\n\nEste mensaje se borrara en unos segundos', {
        chat_id: json.message.chat.id,
        message_id: savedMsg.get(CBObject.p[0]),
      }).then((data) => {
        setTimeout(() => {
          bot.deleteMessage(data.chat.id, data.message_id).catch((e) => {
            logger.error(`Error deleting message ${e}`);
          });
        }, 10000);
        clearTimeout(savedTimers.get(CBObject.p[0]));
        savedMsg.delete(CBObject.p[0]);
        savedTimers.delete(CBObject.p[0]);
      }).catch((e) => {
        logger.error(`Falla al editar mensaje de verificacion ${e}`);
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

//TODO: Rework this part. Maybe a separate file?
bot.on('new_member', (msg) => {
  console.log('test2');
  if (savedMsg.get(msg.from.id) === undefined) {
    bot.sendMessage(msg.chat.id, `Hola ${msg.from.first_name}${msg.from.last_name || ''} bienvenido al grupo de consultas ${msg.chat.title} de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.\nEste mensaje se eliminara en 30 segundos`, { reply_markup: JSON.stringify(adminControllers.verify(msg)) }).then((sentMsg) => {
      savedMsg.set(msg.from.id, sentMsg.message_id);
      savedTimers.set(msg.from.id, setTimeout(() => {
        // Delete Msg if user has not verified in time.
        bot.deleteMessage(msg.chat.id, sentMsg.message_id);
        // Kick Only (Unban is a must, there is no 'kick' method)
        bot.kickChatMember(msg.chat.id, msg.from.id);
        bot.unbanChatMember(msg.chat.id, msg.from.id);
        savedMsg.delete(msg.from.id);
        savedTimers.delete(msg.from.id);
      }, 30000));
    }).catch((e) => {
      // Catch for all the possible errors that will bubble up: (Unable to ban / Unable to delete message)
      logger.error(`Error en verificacion ${e}`);
    });
  } else {
    logger.info('Intento de verificacion doble.');
  }
});

// Ban or Kick
// const bankick = require('./controllers/bankick');
// bot.onText(/^\/(ban|kick)( .*)?/, (msg, match) => {
// 	console.log('kicking!!!!')
//   bankick.ban(bot, match, msg)
// });

// Estadisticas
// bot.onText(/[\s\S]+/g, mongo.insertMessage);
// RemindMe
// bot.onText(/^\/remindme [0-9]+ (d|h|m|s|w)( .*)?/, (msg, match) => onText.remindme(bot, msg, match));

// Sends chatId, useful for debugging
bot.onText(/^\/id/, async (msg) => {
  if(await utils.isAdmin(bot, msg))
    bot.sendMessage(msg.chat.id, `chatId: <code>${msg.chat.id}</code>`, {reply_to_message_id: msg.message_id, parse_mode: 'HTML'});
});

/*
bot.onText(/^\/getgroups/, async () => {
  logger.info('Getting groups');
  let grupos = await GroupService.getGroupsIDs();
  console.log(grupos);
});
bot.onText(/^\/savegroup/, async (msg) => {
  logger.info('Saving group');
  await GroupService.saveGroup(msg);
});
*/