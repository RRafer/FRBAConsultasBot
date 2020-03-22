const generic = require('../generic');

exports.execute = (bot, msg, match) => {
    return new Promise((resolve, reject) => {
        try
        {
            const chatId = msg.chat.id;
            const userId = msg.from.id;    
            const mention = generic.generateMention(msg);    
            const replyMessageId = msg.reply_to_message != undefined ? msg.reply_to_message.message_id : null;
            //const possibleAmount = match[0].replace(/^([a-z]|[A-Z]| |\/)*/, '');
            const typeOfUnit = match[1];
            var possibleAmount = match[0];

            switch(typeOfUnit)
            {
                case 'm':
                    possibleAmount = possibleAmount.substring(10, generic.getPosition(possibleAmount, typeOfUnit, 3));
                    break;
                case 'd':
                    possibleAmount = possibleAmount.substring(10, generic.getPosition(possibleAmount, typeOfUnit, 2));
                    break;
                default:
                    possibleAmount = possibleAmount.substring(10, possibleAmount.indexOf(typeOfUnit));
                    break;
            }
            
            const textToRemember = match[2];

            if(isNaN(possibleAmount) || match.length < 3)
            {
                console.log("died")
                resolve();
                return;
            }

            const amount = parseInt(possibleAmount);    
            const results = generic.generateTimeInMiliseconds(typeOfUnit, amount);
            const timeToSet = results[0];
            const spanishTypeOfUnit = results[1];
            var counter = 0;

            const message = 'Te voy a recordar dentro de ' + amount + generic.space + spanishTypeOfUnit + 
                generic.space + mention + '!';

            bot.sendMessage(chatId, message, { parse_mode: generic.markDownParseMode }).catch(e => reject(e));
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

                        var message = '';

                        if(replyMessageId != null)
                        {
                            message = 'Te recuerdo ' + mention + '!';
                            bot.sendMessage(chatId, message, {
                                reply_to_message_id: replyMessageId, 
                                parse_mode: generic.markDownParseMode
                            }).catch(() => {
                                reject();
                            });
                        }
                        else
                        {
                            if(textToRemember == undefined || textToRemember == ' ')
                            {
                                message = 'Te recuerdo' + mention + '!';
                            }
                            else
                            {
                                message = 'Te recuerdo' + textToRemember + ' ' + mention + '!';
                            }

                            bot.sendMessage(chatId, message, {
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
    
}