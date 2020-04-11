// @ts-check
// TODO: Refactor this.
const logger = require('../utils/logger');
const GroupService = require('../services/group');
const GroupsJSON = require('../resources/allgroups.json');
//const inlineKeyboard = require('../resources/links.json');

// On loading this file, save groups to DB
GroupService.saveGroupFromFile(GroupsJSON);

exports.sendLinks = async (bot, msg) => {
  let groupsFromDB = await GroupService.loadGroupFromDB();
  let message = '';
  Object.values(groupsFromDB).map((x) =>{
    message += `<b>${x.label}</b>\n${x.link}\n`;
  });
  bot.sendMessage(msg.chat.id, message, {reply_to_message_id: msg.message_id, parse_mode: 'HTML' , disable_web_page_preview: true});
};


// This will be useful for the refactor later on
/*
exports.sendLinks = (bot, msg) => {
  bot.sendMessage(msg.chat.id, 'LINKS', {
    reply_markup: {
      inline_keyboard: inlineKeyboard,
    },
    reply_to_message_id: msg.message_id,
  });

  const msgLinks = msg.message_id + 1;

  bot.on('callback_query', (link) => {
    logger.info(`Recieved Callback Query: ${link}`);

    if (!link.from.id === link.message.reply_to_message.from.id)
      return bot.answerCallbackQuery({callback_query_id: link.id, text: 'No puede verificar por otro usuario', show_alert: true});

    if (link.data === 0) 
      return bot.editMessageText('LINKS', {reply_markup: {inline_keyboard: inlineKeyboard}, message_id: msgLinks, chat_id: msg.chat.id});

    let groups = require(`../resources/groups/${link.data}`);
    groups.push([{text: 'Atras', callback_data: 0}]);

    bot.editMessageText('GRUPOS', {chat_id: msg.chat.id, message_id: msgLinks, reply_markup: {inline_keyboard: groups}});
    groups.pop();
  });
};
*/