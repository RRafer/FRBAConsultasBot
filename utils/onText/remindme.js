const generic = require('../generic');

exports.execute = (bot, msg, match) => {
	return new Promise((resolve, reject) => {
		try
		{
			const chatId = msg.chat.id;
			const userId = msg.from.id;    
			const mention = generic.generateMention(msg);    
			const replyMessageId = (msg.reply_to_message) ? msg.reply_to_message.message_id : null;
			const Amount = match[1];
			let typeOfUnit = match[2]; //days or whatever
            
			const textToRemember = match[3];

			const amount = parseInt(Amount);    
			const results = generic.generateTimeInMiliseconds(typeOfUnit, amount);
			const timeToSet = results[0];
			const spanishTypeOfUnit = results[1];
			var counter = 0;

			bot.sendMessage(chatId, `Te voy a recordar dentro de ${amount} ${spanishTypeOfUnit} ${mention}!`, { parse_mode: generic.markDownParseMode }).catch(e => reject(e));
			setInterval(() => {
				counter++;

				if(counter == timeToSet)
				{
					bot.getChatMember(chatId, userId).then(member => {
						switch(member.status)
						{
						case generic.statusKick:
						case generic.statusLeft:
							return;
						}

						if(replyMessageId != null)
						{
							
							bot.sendMessage(chatId, `Te recuerdo ${mention}!`, {
								reply_to_message_id: replyMessageId, 
								parse_mode: generic.markDownParseMode
							}).catch(() => {
								reject();
							});
						}
						else
						{
							bot.sendMessage(chatId, `Te recuerdo ${textToRemember || ''} ${mention} !`, {
								parse_mode: generic.markDownParseMode
							}).catch(() => {
								reject();
							});
						}
					}).catch(e => reject(e));
				}
			}, 1000);
		}
		catch(error)
		{
			reject(error);
		}
        
	});
    
};