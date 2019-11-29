//ids, temporal hasta que los carguemos en la DB
let groupIDs = ['-1001262375149','-1001214086516', '-1001155863433', '-1001249368906', '-1001387811266', '-1001172707925','-1001386498425','-1001205439751','-1001337509181','-1001259839523','-1001289702550','-1001255281308','-1001171982049','-1001203933567','-1001313951685', '-1001157259051', '-1001290861768', '-1001378858456', '-1001288012396','-1001485242696', '-1001370286549', '-1001394632264', '-1001286595347', '-1001396035324', '-1001177806644'];

//TODO: Agregar el segundo comando para el tiempo.
exports.nuke = (bot, command, usersList, msg) => {

	let idToBan;
	//Check group
	if (groupIDs.includes(msg.chat.id)){
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
							//Bug?: If multiple entities, only takes the last one.
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
				if(idToBan != null){

					bot.getChatMember(msg.chat.id, msg.from.id).then(userMember => {                    
						if(userMember.status == 'creator' || userMember.status == 'administrator'){
							bot.kickChatMember(msg.chat.id, idToBan).then(() => {
								if (command[1] == 'kick')
									bot.unbanChatMember(msg.chat.id, idToBan);
							}).catch(err => {
								console.log(err);
							});
						}
					});
				}
			}
		});
	}
};