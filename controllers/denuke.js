// @ts-check

const { generateMention } = require('../utils/generic');
const { groupIDs } = require('../utils/config');
const logger = require('./logger');

exports.denuke = (bot, usersList, msg) => {

	// Check group
	if (!groupIDs.includes(msg.chat.id)) return;

	// Get Credentials of invoking user
	bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
		
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
		if (msg.entities){
			msg.entities.forEach((entity) => {
				
				// If user is mentioned and it has NO @username
				if (entity.type == 'text_mention'){
					idToBan.push(entity.user.id);
					// I accept Ideas about this line, help me please this is an eldritch horror
					mentionToBan.push(`[@${entity.user.username||(`${entity.user.first_name}${entity.user.last_name ? ` ${entity.user.last_name}` : ''}`)}](tg://user?id=${entity.user.id})`); 
				}
				
				// If user is mentioned but has @username
				if (entity.type == 'mention'){
					let nameToSearch = msg.text.substr(entity.offset+1,entity.length-1);
					// Can I change this to map.Values to make it more efficient?								
					usersList.forEach((v,k) => {
						if (v == nameToSearch){
							idToBan.push(k);
							mentionToBan.push(`[@${v}](tg://user?id=${idToBan})`);
						}
					});
				}
			});		
		}
		
		// return early if idToBan was empty
		if(!idToBan.length) return;

		groupIDs.forEach((chatGroupId) => {
			// I have to check permissions for EVERY group
			bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
				// Check if invoker is admin in THAT group, also: Early return? Or should I use continue?
				if(userMember.status != 'creator' && userMember.status != 'administrator') return;
				
				// Loop through the idToBan (usually, should be only one)
				idToBan.forEach((id) => {
					// Get credentials for that user
					bot.getChatMember(msg.chat.id, id).then((userToBan) => {
						
						// Can't ban admins in the groups - Also: Early return? Or should I use continue?
						if(userToBan.status == 'creator' && userToBan.status == 'administrator') return;

						bot.unbanChatMember(chatGroupId, id).then(() => {
							if (chatGroupId == msg.chat.id)
								bot.sendMessage(chatGroupId, `${generateMention(msg)} ha desbaneado a ${mentionToBan} !`, { parse_mode: 'Markdown' }).catch(err => { logger.error(`Error sending message after banning user: ${err}`);}); // Catch weird errors?
						}).catch(err => { logger.error(`Error unbanning user: ${err}`);}); // Catch 'cannot unban user' errors
					}).catch(err => logger.error(`Error getting chat member: ${err}`)); // Catch error: 'can't get chat member'		
				});		
			}).catch(err => logger.error(`Error getting user permissions for the caller: ${err}`)); // Catch error: 'can't get chat member'	
		});
	}).catch(err => logger.error(`Error ${err}`)); //catch all the possible errors here so they don't bubble (And log them so we fix this code)
};