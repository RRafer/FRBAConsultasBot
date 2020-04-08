// @ts-check
const UserService = require('../services/user');
const { groupIDs } = require('../utils/config');

const logger = require('./logger');

//TODO: Agregar el segundo comando para el tiempo.
// Can I refactor this into async / await?
exports.ban = (bot, command, msg) => {
	let idToBan = new Array;

	//Check group
	if (!groupIDs.includes(msg.chat.id)) return;
	
	// Get credentials of invoking user
	bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {
		
		//Check Credentials
		if(userMember.status != 'creator' && userMember.status != 'administrator') return;
		
		// If replying a message, ban the author
		if (msg.reply_to_message) idToBan.push(msg.reply_to_message.from.id);
		
		// If user is mentioned
		
		(msg.entities || []).forEach(async (entity) => {
			// If user is mentioned and it has @username also If multiple entities, push them into an array.
			if (entity.type == 'text_mention') idToBan.push(entity.user.id);
			// If user is mentioned but has no @username	
			if (entity.type == 'mention'){
				let foundId = await UserService.getUserId(msg.text.substr(entity.offset+1,entity.length-1));
				if(foundId) idToBan.push(foundId);
			}	
		});
		
		// Return on empty array
		if(!idToBan.length) return;

		// Loop through Ids and ban each
		idToBan.forEach((id) => {
			bot.kickChatMember(msg.chat.id, id).then(() => {
				if (command[1] == 'kick') 
					bot.unbanChatMember(msg.chat.id, id);
			}).catch(err => {
				logger.error(`Error kicking chat member ${id}: ${err}`);
			});
		});
	});
		
};