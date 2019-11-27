/* eslint-disable no-console */

//ids, temporal hasta que los carguemos en la DB

let groupIDs = ['-1001262375149','-1001214086516'];

exports.banall = (bot, usersList, msg) => {

	let idToBan;
	//Check Credentials of invoking user
	bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
		if(userMember.status == 'creator' || userMember.status == 'administrator'){
			//Bans author of the replied message
			if (msg.reply_to_message){
				idToBan = msg.reply_to_message.from.id;
			}
			else{
				//If user is mentioned with @username
				if (msg.entities){
					msg.entities.forEach((entity) => {
						//If user is mentioned and it has @username
						if (entity.type == 'text_mention'){
							idToBan = entity.user.id;
						}
						else{
							if (entity.type == 'mention'){
								//If user is mentioned but has no @username
								let nameToSearch = msg.text.substr(entity.offset+1,entity.length-1);								
								usersList.forEach((v,k) => {
									if (v == nameToSearch){
										idToBan = k;
									}
								});
							}
						}
					});
					
				}
			}
			groupIDs.forEach((chatGroupId) => {
				bot.kickChatMember(chatGroupId, idToBan).then(() => {
				}).catch(err => {
					console.log(err);
				});
			});
		}
    
	});
};