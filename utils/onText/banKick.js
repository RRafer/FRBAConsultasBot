const generic = require('../generic');

exports.execute = (bot, msg, match) => {
    if(msg.reply_to_message == undefined)
    {
        return;
    }

    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;    
    var replyUsername = msg.reply_to_message.from.username;
    var banOrKick = match[1];
    var numberOfSeconds = match[2];
    numberOfSeconds.replace(' ', '');

    switch(replyUsername)
    {
        case generic.botUserName:
            return;        
    }    

    bot.getChatMember(chatId, replyId).then(replyMember => {
        switch(replyMember.status)
        {
            case generic.statusKick:
            case generic.statusLeft:
            case generic.statusCreator:
            case generic.statusAdministrator:
                return;
        }

        bot.getChatMember(chatId, userId).then(userMember => {
            const userMention = generic.generateMention(msg);
            switch(userMember.status)
            {
                case generic.statusCreator:
                case generic.statusAdministrator:
                    const replyMention = generic.generateMention(msg.reply_to_message);
                    switch (banOrKick)
                    {
                        case 'ban':                            
                            if(numberOfSeconds == '' || isNaN(numberOfSeconds))
                            {
                                bot.kickChatMember(chatId, replyId).then(() => {
                                    bot.sendMessage(chatId, userMention + ' ha baneado a ' + replyMention + ' indefinidamente!', { parse_mode: generic.markDownParseMode });
                                });
                            }
                            else
                            {
                                bot.kickChatMember(chatId, replyId, {until_date: Math.round((Date.now() + (parseInt(numberOfSeconds) * 1000)) / 1000)}).then(() => {
                                    bot.sendMessage(chatId, userMention + ' ha baneado a ' + replyMention + "  durante " + numberOfSeconds + " segundos!", { parse_mode: generic.markDownParseMode });
                                });
                            }
                            break;
                        case 'kick':
                            bot.kickChatMember(chatId, replyId).then(() => {
                                bot.unbanChatMember(chatId, replyId);                  
                                    bot.sendMessage(chatId, userMention + ' ha kickeado a ' + replyMention + '!', { parse_mode: generic.markDownParseMode });
                            });
                            break;
                    }
                    break;
                default:
                    bot.sendMessage(chatId, "Sory" + userMention + " pero no sos admin.", { parse_mode: generic.markDownParseMode });
                    break;
            }
        });
    });
};