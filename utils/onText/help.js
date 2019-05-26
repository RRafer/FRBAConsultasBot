const generic = require('../generic');

exports.execute = (bot, msg, mongo) => {
    const msgChatId = msg.chat.id;
    const msgId = msg.message_id;
    const helpMessage = 'Mirá, por ahora tengo:' + generic.lineBreak 
    + '/catedra - _Te paso una imagen de los horarios de cátedra._' + generic.lineBreak + 
    '/links - _Te paso un menú re piola para que obtengas los links que necesitas._' + generic.lineBreak
    + '/remindme *<cantidad de tiempo> <unidad de tiempo en inglés> <mensaje> [opcional]* - _Te hago recordar algo después de una cantidad de tiempo, según la unidad. Si me mandás mensaje, te hago recordar el mensaje. Sino, te hago recordar el mensaje que estés respondiendo. Si no me mandás mensaje ni respondés alguno, te mando un recordatorio genérico._';
    const notStartedMessage = 'Tenés que iniciarme por privado con /start.';

    mongo.getPrivateChatId(msg.from.id, msg.chat.id).then(chatId => {  
        bot.sendMessage(chatId, helpMessage, {parse_mode: generic.markDownParseMode});
    }).catch(() => {
        bot.sendMessage(msgChatId, notStartedMessage, {reply_to_message_id: msgId});
  });
}