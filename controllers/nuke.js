// @ts-check

const UserService = require('../services/user');

const utils = require('../utils/generic');
const { groupIDs } = require('../utils/config');

const logger = require('../utils/logger');

exports.nuke = async (bot, msg) => {
	
  logger.info('Checking if group is in the list ' + msg.chat.id);

  // Check group
  if (!groupIDs.includes(msg.chat.id)) return;
	
  // Get Credentials of invoking user
  logger.info('Getting user credentials');
  if (await utils.isAdmin(bot, msg)) return logger.warn('Could not kick the user, they\'re admin/owner!');
		
  let idToBan = new Array, mentionToBan = new Array;

  // Little log to check functionality
  logger.info('Deploying Low-orbit Nuke...');

  // If replying a message ban the author
  if (msg.reply_to_message){
    idToBan.push(msg.reply_to_message.from.id);
    mentionToBan.push(utils.generateMention(msg.reply_to_message));
  }

  // If user is mentioned
  (msg.entities || []).forEach(async (entity) => {

    // If user is mentioned and it has NO @username
    if (entity.type == 'text_mention'){
      idToBan.push(entity.user.id);
      // I accept Ideas about this line, help me please this is an eldritch horror
      mentionToBan.push(`[@${entity.user.username||(`${entity.user.first_name}${entity.user.last_name ? ` ${entity.user.last_name}` : ''}`)}](tg://user?id=${entity.user.id})`); 
    }

    // If user is mentioned but has @username
    if (entity.type == 'mention'){
      let entityString = msg.text.substr(entity.offset+1,entity.length-1);
      let foundId = await UserService.getUserId(entityString);
      if(foundId){
        idToBan.push(foundId);
        mentionToBan.push(`[@${entityString}](tg://user?id=${idToBan})`);
      }
    }
  });
	
	
  logger.info(`Found a total of ${idToBan.length} users to ban`);

  // return early if idToBan was empty
  if(!idToBan.length) return;

  groupIDs.forEach(async (chatGroupId) => {
    logger.info(`Looping through group ${chatGroupId} checking credentials`);
    // I have to check permissions for EVERY group
    if (await utils.isAdmin(bot, msg, {chatID: chatGroupId})) return logger.warn(`Could not denuke the user here, the requester is not admin in ${chatGroupId}!`);
				
    // Loop through the idToBan (usually, should be only one)
    idToBan.forEach(async (id) => {
      // Get credentials for that user
      if (await utils.isAdmin(bot, msg, {chatID: chatGroupId, userID: id})) return logger.warn(`Could not denuke the user here, they're admin/owner of ${chatGroupId}!`);

      logger.info(`Banning ${id} from group ${chatGroupId}`);
      await bot.kickChatMember(chatGroupId, id).catch(err => { logger.error(`Error banning user: ${err}`);}); // Catch 'cannot ban user' errors			
    });
  });
  bot.sendMessage(msg.chat.id, `${utils.generateMention(msg)} ha banneado a ${mentionToBan} !`, { parse_mode: 'Markdown' }).catch(err => { return logger.error(`Error sending message after banning user: ${err}`);}); // Catch weird errors?
};