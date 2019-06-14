const generic = require('../generic');

exports.execute = (bot, msg, match) => {
    return new Promise((resolve, reject) => {
        if(msg.reply_to_message == undefined || msg.text == '/banall')
        {
            resolve();
            return;
        }

        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const replyId = msg.reply_to_message.from.id;    
        const replyUsername = msg.reply_to_message.from.username;
        const banOrKick = match[1];
        const maybeParams = match[2];
        const areParams = maybeParams != undefined && maybeParams.replace(' ', '') != '';
        var params = [];
        var amount = 0;
        var typeOfUnit = '';
        var timeToSet = 0;
        var spanishTypeOfUnit = '';
        
        if(areParams)
        {
            try
            {
                params = maybeParams.split(' ');
                const maybeAmount = params[1];

                if(params.length != 3 || isNaN(maybeAmount)) 
                {
                    resolve();
                    return;
                }
                
                amount = parseInt(maybeAmount);
                typeOfUnit = params[2];
                result = generic.generateTimeInMiliseconds(typeOfUnit, amount);
                timeToSet = result[0];
                spanishTypeOfUnit = result[1];
            }
            catch(error)
            {
                reject(error);
                return;
            }            
        }       

        switch(replyUsername)
        {
            case generic.botUserName:
                resolve();
                return;
        }    

        bot.getChatMember(chatId, replyId).then(replyMember => {
            switch(replyMember.status)
            {
                case generic.statusKick:
                case generic.statusLeft:
                case generic.statusCreator:
                case generic.statusAdministrator:
                    resolve();
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
                                if(areParams)
                                {
                                    bot.kickChatMember(chatId, replyId, {until_date: Math.round((Date.now() + (timeToSet * 1000)) / 1000)}).then(() => {
                                        bot.sendMessage(chatId, userMention + ' ha baneado a ' + replyMention + "  durante " + amount + ' ' + spanishTypeOfUnit + '!', { parse_mode: generic.markDownParseMode })
                                            .then(() => {
                                                resolve();
                                                return;
                                            })
                                            .catch(e => {
                                                reject(e);
                                                return;
                                            });
                                    }).catch(e => {
                                        reject(e);
                                        return;
                                    });
                                }
                                else
                                {
                                    bot.kickChatMember(chatId, replyId).then(() => {
                                        bot.sendMessage(chatId, userMention + ' ha baneado a ' + replyMention + ' indefinidamente!', { parse_mode: generic.markDownParseMode })
                                            .then(() => resolve())
                                            .catch(e => {
                                                reject(e);
                                                return;
                                            });
                                    }).catch(e => {
                                        reject(e);
                                        return;
                                    });
                                }
                                break;
                            case 'kick':
                                bot.kickChatMember(chatId, replyId).then(() => {
                                    bot.unbanChatMember(chatId, replyId).then(() => {
                                        bot.sendMessage(chatId, userMention + ' ha kickeado a ' + replyMention + '!', { parse_mode: generic.markDownParseMode })
                                            .then(() => {
                                                resolve();
                                                return;
                                            })
                                            .catch(e => {
                                                reject(e);
                                                return;
                                            });
                                    }).catch(e => {
                                        reject(e);
                                        return;
                                    });                               
                                }).catch(e => {
                                    reject(e);
                                    return;
                                });
                                break;
                        }
                        break;
                    default:
                        bot.sendMessage(chatId, "Sory" + userMention + " pero no sos admin.", { parse_mode: generic.markDownParseMode })
                            .then(() => {
                                resolve();
                                return;
                            })
                            .catch(e => {
                                reject(e);
                                return;
                            });
                        break;
                }
            }).catch(e => {
                reject(e);
                return;
            });
        }).catch(e => {
            reject(e);
            return;
        });
    });
    
};