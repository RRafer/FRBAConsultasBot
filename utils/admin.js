
exports.validateUser=(bot) => (msg) => {
    var verify = {
        "inline_keyboard": [
            [
                {text: "Haga clic aquí", callback_data: 'verificarbot'}
            ]
        ]
    };

    const RemPerms = {
        perms: can_send_message = false,
        perms: can_send_media_messages = false,
        perms: can_send_other_messages = false,
        perms: can_add_web_page_previews = false
    };

    const GivePerms = {
        perms: can_send_message = true,
        perms: can_send_media_messages = true,
        perms: can_send_other_messages = true,
        perms: can_add_web_page_previews = true
    };

    var userId;
    var msgBienvenida;

    if (msg.new_chat_members !== undefined) {
        userId = msg.new_chat_members[0].id;
        bot.restrictChatMember(msg.chat.id, userId, RemPerms).then(function (result) {
            bot.sendMessage(msg.chat.id, "Hola " + msg.new_chat_members[0].first_name + ", bienvenido al grupo de consultas " + msg.chat.title + " de la UTN - FRBA\n\nHaga clic en el boton de abajo para verificar que no sea un bot.", {"reply_markup": JSON.stringify(verify)});
            msgBienvenida = msg.message_id + 1;
        })
    }

    bot.on('callback_query', function onCallbackQuery(accionboton) {

        if (accionboton.data === 'verificarbot') {
            if (userId === accionboton.from.id) {
                bot.promoteChatMember(msg.chat.id, userId, GivePerms);
                bot.editMessageText("¡Has sido verificado! \u2705\n\nEste mensaje se borrara en unos segundos", {
                    chat_id: msg.chat.id,
                    message_id: msgBienvenida
                }).then(function (data) {
                    setTimeout(function () {
                        bot.deleteMessage(data.chat.id, data.message_id);
                    }, 10000);
                })
            } else {
                bot.answerCallbackQuery({
                    callback_query_id: accionboton.id,
                    text: "No puede verificar por otro usuario",
                    show_alert: true
                });
            }
        }
    })
}