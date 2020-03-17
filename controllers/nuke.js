// @ts-check
/* eslint-disable no-console */
const { generateMention } = require('../utils/generic');
const logger = require('./logger');

//ids, temporal hasta que los carguemos en la DB

let groupIDs = ['-1001214086516','-1001262375149','-1001214086516', '-1001155863433', '-1001249368906', '-1001387811266', '-1001172707925','-1001386498425','-1001205439751','-1001337509181','-1001259839523','-1001289702550','-1001255281308','-1001171982049','-1001203933567','-1001313951685', '-1001157259051', '-1001290861768', '-1001378858456', '-1001288012396','-1001485242696', '-1001370286549', '-1001394632264', '-1001286595347', '-1001396035324', '-1001177806644'];

exports.nuke = (bot, usersList, msg) => {

	let idToBan, mentionToBan;
	logger.info('Nuking....');
	//Check group
	if (groupIDs.includes(msg.chat.id)){
	//Check Credentials of invoking user
		bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
			if(userMember.status == 'creator' || userMember.status == 'administrator'){
			//Bans author of the replied message
				if (msg.reply_to_message){
					idToBan = msg.reply_to_message.from.id;
					mentionToBan = generateMention(msg.reply_to_message);
				}
				else{
				//If user is mentioned with @username
					if (msg.entities){
						msg.entities.forEach((entity) => {
						//If user is mentioned and it has NO @username
							if (entity.type == 'text_mention'){
								idToBan = entity.user.id;
								let fromName = `${entity.user.first_name}${entity.user.last_name ? ` ${entity.user.last_name}` : ''}`;
								mentionToBan = `[@${entity.user.username||fromName}](tg://user?id=${entity.user.id})`; 
							}
							else{
								if (entity.type == 'mention'){
								//If user is mentioned but has @username
									let nameToSearch = msg.text.substr(entity.offset+1,entity.length-1);								
									usersList.forEach((v,k) => {
										if (v == nameToSearch){
											idToBan = k;
											mentionToBan = `[@${v}](tg://user?id=${idToBan})`;
										}
									});
								}
							}
						});
					
					}
				}
				if(idToBan != null){
					groupIDs.forEach((chatGroupId) => {
						bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
							if(userMember.status == 'creator' || userMember.status == 'administrator'){
								bot.getChatMember(msg.chat.id, idToBan).then((userToBan) => {
									if(userToBan.status != 'creator' && userToBan.status != 'administrator'){
										bot.kickChatMember(chatGroupId, idToBan).then(() => {
											if (chatGroupId == msg.chat.id)
												bot.sendMessage(chatGroupId, `${generateMention(msg)} ha kickeado a ${mentionToBan} !`, { parse_mode: 'Markdown' });
										}).catch(err => {
											//Catch 'cannot ban user' errors
											logger.error(`Error banning user: ${err}`);
										});
									}
								}).catch(err => logger.error(`Error gettin chat member: ${err}`)); //catch error: 'can't get chat member'
							}
						
						}).catch(err => logger.error(`Error ${err}`));
					});
				}
			}
		}).catch(err => logger.error(`Error ${err}`)); //catch all the possible errors here so they don't bubble
	}
};