exports.sendLinks = bot => msg => {
    bot.sendMessage(msg.chat.id, "LINKS", {
        reply_markup: {
            inline_keyboard: require('../resources/links.json')
        },
        reply_to_message_id: msg.message_id
    });

    var msgLinks = msg.message_id + 1;

    bot.on('callback_query', (link) => {
        console.log(msgLinks);

        if (link.from.id === link.message.reply_to_message.from.id) {


            if(link.data == 0){
                bot.editMessageText("LINKS", {
                    reply_markup: {
                        inline_keyboard: require('../resources/links.json')
                    },
                    message_id:msgLinks,
                    chat_id: msg.chat.id
                });
            } else {

                var groups = require('../resources/groups/' + link.data);
                groups.push([
                    {
                        text: "Atras",
                        callback_data: 0
                    }
                ])


                bot.editMessageText("GRUPOS", {
                    chat_id: msg.chat.id,
                    message_id: msgLinks,
                    reply_markup: {
                        inline_keyboard: groups
                    }
                });
            groups.pop();
            }
        } else {
            bot.answerCallbackQuery({
                callback_query_id: link.id,
                text: "No puede verificar por otro usuario",
                show_alert: true
            });
        }
    })
}


exports.sendLinks2 = bot => msg => {


    let words = msg.text.split(/(\s+)/).filter( e => e.trim().length > 0);
    let linksMsg = require('../resources/links2.json');
    let message;
    console.log(words)

    if(words.length > 1) {

        let stringSimilarity = require('string-similarity');

        let bestMatch =stringSimilarity.findBestMatch(words[1],linksMsg.map(link => link.departament)).bestMatch.target
        console.log(bestMatch);
        linksMsg = linksMsg.filter(link => link.departament === bestMatch );

    }

    message = linksMsg.map(link => "• ["+link.text+"]("+ link.url+")").reduce((x, y) => x +"\n"+y);

    bot.sendMessage(msg.chat.id, message,{parse_mode : "Markdown"} );


}