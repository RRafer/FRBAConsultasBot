/* eslint-disable no-console */

//ids, temporal hasta que los carguemos en la DB

let groupIDs = ['-1001262375149','-1001214086516'];

exports.banall = (bot, users, msg) => {

	//ID to ban: msg.reply_to_message.from.id
	if (msg.reply_to_message){
		bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
			if(userMember.status == 'creator' || userMember.status == 'administrator'){
				//foreach group =>
				groupIDs.forEach((chatGroupId) => {
					bot.kickChatMember(chatGroupId, msg.reply_to_message.from.id).then(() => {
						console.log('Banneado');
					})
						.catch(err => {
							console.log(err);
						});
				});
			}
		});
	}
	else{
		if (msg.entities && msg.entities[0].user){
			//{ offset: 5, length: 9, type: 'mention' } 0 [ { offset: 5, length: 9, type: 'mention' } ]
			//algo
			bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
				if(userMember.status == 'creator' || userMember.status == 'administrator'){
					//foreach group =>
					groupIDs.forEach((chatGroupId) => {
						bot.kickChatMember(chatGroupId, msg.entities[0].user.id).then(() => {
							console.log('Banneado');
						})
							.catch(err => {
								console.log(err);
							});
					});
				}
			});
		
		}else{
			if (msg.entities && !msg.entities[0].user){
			//{ offset: 5, length: 9, type: 'mention' } 0 [ { offset: 5, length: 9, type: 'mention' } ]
				//algo
				bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
					if(userMember.status == 'creator' || userMember.status == 'administrator'){
						//foreach group =>
						groupIDs.forEach((chatGroupId) => {
							console.log(`Baneando: ${msg.text.substr(msg.entities[0].offset,msg.entities[0].length)}`);
							bot.kickChatMember(chatGroupId, users.get(msg.text.substr(msg.entities[0].offset,msg.entities[0].length))).then(() => {
								console.log('Banneado');
							})
								.catch(err => {
									console.log(err);
								});
						});
					}
    
				});
			}
			//Text mention now:
    
		}
	}
};