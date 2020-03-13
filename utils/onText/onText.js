const mongo = require('../mongo');
const help = require('./help');
const banKick = require('./banKick');
const remindme = require('./remindme');
const start = require('./start');
const catedra = require('./catedra');
const stickers = require('./stickers');

exports.start = (bot, msg) => {   
  start.execute(bot, msg).catch(err => {
    const messageError = 'Hubo un error. Por favor, mandame /start en unos minutos.';
    
    bot.sendMessage(msg.chat.id, messageError)
      .catch(err => mongo.logError(err, chatId));
    mongo.logError(err, msg.chat.id);
  });
}

exports.remindme = (bot, msg, match) => remindme.execute(bot, msg, match).catch(err => mongo.logError(err, msg.chat.id));

exports.banKick = (bot, msg, match) => banKick.execute(bot, msg, match).catch(err => mongo.logError(err, msg.chat.id));

exports.help = (bot, msg) => help.execute(bot, msg, mongo).catch(err => mongo.logError(err, msg.chat.id));

//exports.catedra
//exports.stickers