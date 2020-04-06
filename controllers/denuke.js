// @ts-check

const { generateMention } = require('../utils/generic');
const { groupIDs } = require('../utils/config');
const databaseController = require('./database');
const logger = require('./logger');

exports.denuke = async (bot, msg) => {

	logger.info('Checking if group is in the list ' + msg.chat.id);

	// Check group
	if (!groupIDs.includes(msg.chat.id)) return;
	
	logger.info('Getting user credentials');
	// Get Credentials of invoking user
	let userMember = await bot.getChatMember(msg.chat.id, msg.from.id).catch(err => {return logger.error(`De-Nuke: Cannot get user: ${err}`);}); //catch 'Cannot get user'
		
	// Check if credentials are valid
	if(userMember.status != 'creator' && userMember.status != 'administrator') return;
		
	let idToBan = new Array, mentionToBan = new Array;

	// Little log to check functionality
	logger.info('Restoring user to existance...');

	// If replying a message ban the author
	if (msg.reply_to_message){
		idToBan.push(msg.reply_to_message.from.id);
		mentionToBan.push(generateMention(msg.reply_to_message));
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
			let foundId = await databaseController.getUserId(entityString);
			if(foundId){
				idToBan.push(foundId);
				mentionToBan.push(`[@${entityString}](tg://user?id=${idToBan})`);
			}
		}
	});		

	
	logger.info(`Found a total of ${idToBan.length} users to unban`);

	// return early if idToBan was empty
	if(!idToBan.length) return;

	groupIDs.forEach(async (chatGroupId) => {
		logger.info(`Looping through group ${chatGroupId} checking credentials`);
		// I have to check permissions for EVERY group
		let userInvoker = await bot.getChatMember(chatGroupId, msg.from.id).catch(err => {return logger.error(`Error getting user permissions for the caller on group(${chatGroupId}): ${err}`);}); // Catch error: 'can't get chat member'	
		
		// Check if invoker is admin in THAT group, also: Early return? Or should I use continue?
		if(userInvoker.status != 'creator' && userInvoker.status != 'administrator') return;
				
		// Loop through the idToBan (usually, should be only one)
		idToBan.forEach(async (id) => {
			// Get credentials for that user
			let userToBan = await bot.getChatMember(chatGroupId, id).catch(err => {return logger.error(`Error getting chat member: ${err}`);}); // Catch error: 'can't get chat member'
						
			// Can't ban admins in the groups - Also: Early return? Or should I use continue?
			if(userToBan.status == 'creator' || userToBan.status == 'administrator') return;

			logger.info(`Giving ${id} CPR in group ${chatGroupId}`);
			await bot.unbanChatMember(chatGroupId, id).catch(err => { logger.error(`Error unbanning user: ${err}`);}); // Catch 'cannot unban user' errors
		});		
	});
	bot.sendMessage(msg.chat.id, `${generateMention(msg)} ha desbaneado a ${mentionToBan} !`, { parse_mode: 'Markdown' }).catch(err => { logger.error(`Error sending message after banning user: ${err}`);}); // Catch weird errors?
};