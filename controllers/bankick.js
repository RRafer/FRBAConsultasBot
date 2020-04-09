// @ts-check
const UserService = require('../services/user');
const { groupIDs } = require('../utils/config');
const utils = require('../utils/generic');

const logger = require('./logger');

// TODO: Agregar el segundo comando para el tiempo.
// Can I refactor this into async / await?
exports.ban = async (bot, command, msg) => {
  let idToBan = new Array;

  // Check group
  if (!groupIDs.includes(msg.chat.id)) return;

  // Check Credentials
  if (await utils.isAdmin(bot, msg)) return logger.warn('Could not kick the user, they\'re admin/owner!');
	
  // If replying a message, ban the author
  if (msg.reply_to_message) idToBan.push(msg.reply_to_message.from.id);
	
  // If user is mentioned
  (msg.entities || []).forEach(async (entity) => {
    // If user is mentioned and it has @username also If multiple entities, push them into an array.
    if (entity.type == 'text_mention') idToBan.push(entity.user.id);
    // If user is mentioned but has no @username	
    if (entity.type == 'mention'){
      let foundId = await UserService.getUserId(msg.text.substr(entity.offset+1,entity.length-1));
      if (foundId) idToBan.push(foundId);
    }	
  });
	
  // Return on empty array
  if(!idToBan.length) return logger.warn('Someone tried to kick a person, but we couldn\'t find a way to refer to them!');

  // Loop through Ids and ban each
  idToBan.forEach(async (id) => {
    try {
      await bot.kickChatMember(msg.chat.id, id);
      if (command[1] == 'kick') 
        bot.unbanChatMember(msg.chat.id, id);
    } catch (err) {
      logger.error(`Error kicking chat member ${id}: ${err}`);
    }
  });
		
};