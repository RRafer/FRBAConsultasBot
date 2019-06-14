const generic = require('../generic');
const mongo = require('../mongo');


exports.execute = (bot, msg) => {
    return new Promise((resolve, reject) => {
        if(msg.reply_to_message == undefined)
        {
            resolve();
        }

        var chatId = msg.chat.id;
        var userId = msg.from.id;
        var replyId = msg.reply_to_message.from.id;    
        var replyUsername = msg.reply_to_message.from.username;

        switch(replyUsername)
        {
            case generic.botUserName:
                resolve();
                break;        
        }

        const replyMention = generic.generateMention(msg.reply_to_message);
        const userMention = generic.generateMention(msg);

        mongo.getGroupIds(replyId, chatId).then(res => {
            console.log("ENTRÉ A GETGROUPIDS CON VALORES " + res);
            if(res)
            {
                kickUsers(res, bot, replyId, userId, userMention, replyMention).then(() => {
                    console.log("SALÍ DE KICKUSERS EXITOSAMENTE.");
                    resolve();
                }); 
            }                       
        }).catch(err => reject(err));
    });    
};

async function kickUsers(res, bot, replyId, userId, userMention, replyMention)
{
    console.log("ESTOY EN KICKUSERS CON VALOR" + res);
    for (const chatGroupId of res)
    {
        await kickUser(bot, chatGroupId, replyId, userId, userMention, replyMention);
    }
}

function kickUser(bot, chatGroupId, replyId, userId, userMention, replyMention)
{
    return new Promise((resolve, reject) => {
        console.log("ENTRÉ A LA PROMISE");
        bot.getChatMember(chatGroupId, replyId).then(member => {
            console.log("ENTRÉ A GETCHATMEMEBER DE LA PROMISE CON " + chatGroupId + "Y STATUS " + member.status);
            switch(member.status)
            {
                case generic.statusKick:
                case generic.statusLeft:
                case generic.statusCreator:
                case generic.statusAdministrator:
                    resolve();
                    break;
                default:
                    bot.getChatMember(chatGroupId, userId).then(userMember => {    
                        console.log("ENTRÉ A GETCHATMEMBER PARA EL USERID CON STATUS " + userMember.status);    
                        switch(userMember.status)
                        {
                            case generic.statusCreator:
                            case generic.statusAdministrator:
                                bot.kickChatMember(chatGroupId, replyId).then(() => {
                                    console.log("BANIÉ AL PIBE");
                                    bot.sendMessage(chatGroupId, userMention + ' ha baneado a ' + replyMention + '!', { parse_mode: generic.markDownParseMode })
                                        .catch(err => {
                                            mongo.logError(err, chatGroupId);
                                            resolve();
                                        });
                                }).catch(err => {
                                    console.log("NO BANIÉ UN CARAJO PORQUE SALTÓ EL ERROR " + err.message);
                                    if(err.message.includes('need to be inviter'))
                                    {
                                        bot.sendMessage(chatGroupId, 'No puedo bannear a nadie ya que no soy admin :(')
                                            .catch(tgErr => {
                                                mongo.logError(tgErr, chatGroupId);
                                                resolve();
                                            });   
                                    }
                                    else
                                    {
                                        mongo.logError(err, chatGroupId);
                                        resolve();
                                    }
                                });
                                break;
                            default:
                                bot.sendMessage(chatGroupId, "Sory" + userMention + " pero no sos admin.", { parse_mode: generic.markDownParseMode })
                                .catch(tgErr => {
                                    mongo.logError(tgErr, chatGroupId);
                                    resolve();
                                });
                                resolve();
                                break;
                        }
                    }).catch(err => {
                        mongo.logError(err, chatGroupId);
                        resolve();
                    });    
                    break;
            }                     
        }).catch(err => {
            mongo.logError(err, chatGroupId);
            resolve();
        });
    });    
}