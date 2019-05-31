const generic = require('../generic');
const mongo = require('../mongo');


exports.execute = (bot, msg) => {
    if(msg.reply_to_message == undefined)
    {
        return;
    }

    var chatId = msg.chat.id;
    var userId = msg.from.id;
    var replyId = msg.reply_to_message.from.id;    
    var replyUsername = msg.reply_to_message.from.username;

    switch(replyUsername)
    {
        case generic.botUserName:
            return;        
    }

    const replyMention = generic.generateMention(msg.reply_to_message);
    const userMention = generic.generateMention(msg);

    mongo.getGroupIds(userId, chatId).then(res => {
        res.forEach(chatGroupId => {
            bot.getChatMember(chatGroupId, replyId).then(member => {
                switch(member.status)
                {
                    case generic.statusKick:
                    case generic.statusLeft:
                    case generic.statusCreator:
                    case generic.statusAdministrator:
                        return; //MODIFICAR: No debe hacer return, debe salir 
                }

                bot.getChatMember(chatId, userId).then(userMember => {                    
        
                    switch(userMember.status)
                    {
                        case generic.statusCreator:
                        case generic.statusAdministrator:
                            bot.kickChatMember(chatGroupId, replyId).then(() => {
                                bot.sendMessage(chatGroupId, userMention + ' ha baneado a ' + replyMention + '!', { parse_mode: generic.markDownParseMode })
                                    .catch(err => mongo.logError(err, chatGroupId));;
                            })
                            .catch(err => {
                                if(err.message.includes('need to be inviter'))
                                {
                                    bot.sendMessage(chatGroupId, 'No puedo bannear a nadie ya que no soy admin :(')
                                        .catch(tgErr => mongo.logError(tgErr, chatGroupId));     
                                }
                                else
                                {
                                    mongo.logError(err, chatGroupId);
                                }
                            });
                            break;
                        default:
                            bot.sendMessage(chatId, "Sory" + userMention + " pero no sos admin.", { parse_mode: generic.markDownParseMode });
                            break;
                    }
                }).catch(e => mongo.logError(e, chatGroupId));     
            });                                
        });
    });
};



// exports.execute = (bot, msg) => {
//     if(msg.reply_to_message == undefined)
//     {
//         return;
//     }

//     var chatId = msg.chat.id;
//     var userId = msg.from.id;
//     var replyId = msg.reply_to_message.from.id;    
//     var replyUsername = msg.reply_to_message.from.username;

//     switch(replyUsername)
//     {
//         case generic.botUserName:
//             return;        
//     }    

//     bot.getChatMember(chatId, replyId).then(replyMember => {
//         switch(replyMember.status)
//         {
//             case generic.statusKick:
//             case generic.statusLeft:
//             case generic.statusCreator:
//             case generic.statusAdministrator:
//                 return;
//         }

//         bot.getChatMember(chatId, userId).then(userMember => {
//             const userMention = generic.generateMention(msg);

//             switch(userMember.status)
//             {
//                 case generic.statusCreator:
//                 case generic.statusAdministrator:
//                     const replyMention = generic.generateMention(msg.reply_to_message);

//                     mongo.getGroupIds(userId, chatId).then(res => {
//                         res.forEach(chatGroupId => {
//                             bot.getChatMember(chatGroupId, replyId).then(member => {
//                                 switch(member.status)
//                                 {
//                                     case generic.statusCreator:
//                                     case generic.statusAdministrator:
//                                         return;
//                                 }

//                                 bot.kickChatMember(chatGroupId, replyId).then(() => {
//                                     bot.sendMessage(chatGroupId, userMention + ' ha baneado a ' + replyMention + '!', { parse_mode: generic.markDownParseMode })
//                                         .catch(err => mongo.logError(err, chatGroupId));;
//                                 })
//                                 .catch(err => {
//                                     if(err.message.includes('need to be inviter'))
//                                     {
//                                         bot.sendMessage(chatGroupId, 'No puedo bannear a nadie ya que no soy admin :(')
//                                             .catch(tgErr => mongo.logError(tgErr, chatGroupId));     
//                                     }
//                                     else
//                                     {
//                                         mongo.logError(err, chatGroupId);
//                                     }
//                                 });
//                             }).catch(e => mongo.logError(e, chatGroupId));
//                         });
//                     });
//                     break;
//                 default:
//                     bot.sendMessage(chatId, "Sory" + userMention + " pero no sos admin.", { parse_mode: generic.markDownParseMode });
//                     break;
//             }
//         });
//     });
// };