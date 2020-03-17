// Refactor this

/*
const generic = require('../generic');

exports.execute = (bot, msg, mongo) => {
    return new Promise((resolve, reject) => {
        const chatId = msg.chat.id;
        const fromId = msg.from.id;
        const msgId = msg.message_id;
        const helpMessage = 'Mirá, por ahora tengo:' + generic.lineBreak 
        + '/catedra - _Te paso una imagen de los horarios de cátedra._' + generic.lineBreak + 
        '/links - _Te paso un menú re piola para que obtengas los links que necesitas._' + generic.lineBreak
        + '/remindme *<cantidad de tiempo> <unidad de tiempo en inglés> <mensaje> [opcional]* - _Te hago recordar algo después de una cantidad de tiempo, según la unidad. Si me mandás mensaje, te hago recordar el mensaje. Sino, te hago recordar el mensaje que estés respondiendo. Si no me mandás mensaje ni respondés alguno, te mando un recordatorio genérico._';
        const notStartedMessage = 'Tenés que iniciarme por privado con /start.';

        // bot.getChatMember(fromId, fromId)
        // .then(res => console.log("NORMAL: " + JSON.stringify(res, null, '\n')))
        // .catch(e => console.log("ERROR: " + JSON.stringify(e, null, '\n')));

        // reject(new Error('nada'));

        bot.sendMessage(fromId, helpMessage, {parse_mode: generic.markDownParseMode})        
        .then(() => resolve())
        .catch(error => {
            if(error.message.includes('403'))
            {
                bot.sendMessage(chatId, notStartedMessage, {reply_to_message_id: msgId})
                .then(() => resolve())
                .catch(e => reject(e));
            }
            else
            {
                reject(error);
            }
        });
    });    
}

//#region Comentarios

//mongo.getPrivateChatId(msgFromId, msgChatId).then(chatId => {  
        //bot.sendMessage(chatId, helpMessage, {parse_mode: generic.markDownParseMode}).then(res => console.log("RESPUESTITA: " + res)).catch(err => console.log("ERRRRRROR: " + err));
    //}).catch(() => {
        //bot.sendMessage(msgChatId, notStartedMessage, {reply_to_message_id: msgId});
  //});

//#endregion
*/