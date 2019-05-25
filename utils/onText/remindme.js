const generic = require('../generic');

exports.execute = (bot, msg, match) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id;    
    const mention = generic.generateMention(msg);    
    const replyMessageId = msg.reply_to_message != undefined ? msg.reply_to_message.message_id : null;
    const typeOfUnit = match[1];
    const textToRemember = match[2];
    const amount = parseInt(match[0].substring(10, match[0].indexOf(typeOfUnit)));    
    var spanishTypeOfUnit = '';
    var timeToSet = 0;
    var counter = 0;
    
    //Esto es un asco, se modificará en breve.
    //Javascript te odio.
    //Todos putos.
    switch(typeOfUnit)
    {
        case 'days':
        timeToSet = amount * 24 * 60 * 60;
        spanishTypeOfUnit = 'días';
        break;
        case 'day':
        timeToSet = amount * 24 * 60 * 60;
        spanishTypeOfUnit = 'día';
        break;
        case 'hours':
        timeToSet = amount * 60 * 60;
        spanishTypeOfUnit = 'horas';
        break;
        case 'hour':
        timeToSet = amount * 60 * 60;
        spanishTypeOfUnit = 'hora';
        break;
        case 'minutes':
        timeToSet = amount * 60;
        spanishTypeOfUnit = 'minutos';
        break;
        case 'minute':
        timeToSet = amount * 60;
        spanishTypeOfUnit = 'minuto';
        break;
        case 'seconds':
        timeToSet = amount;
        spanishTypeOfUnit = 'segundos';
        break;
        case 'second':
        timeToSet = amount;
        spanishTypeOfUnit = 'segundo';
        break;
        case 'weeks':
        timeToSet = amount * 7 * 24 * 60 * 60;
        spanishTypeOfUnit = 'semanas';
        break;
        case 'week':
        timeToSet = amount * 7 * 24 * 60 * 60;
        spanishTypeOfUnit = 'semana';
        break;
    }

    const message = 'Te voy a recordar dentro de ' + amount + generic.space + spanishTypeOfUnit + 
        generic.space + mention + '!';

    bot.sendMessage(chatId, message, { parse_mode: generic.markDownParseMode });
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
                        return;
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
                    return;
                });
                }
            });
        }
    }, 1000);
}