exports.execute = (bot, msg) => {
    var chatPos = idChatPhoto.indexOf(msg.chat.id);
    if(chatPos === -1)
    {
        var auxid = bot.sendPhoto(msg.chat.id, 'AgADAQADEagxG_BImEVSfV4Gc0JIbXLqCjAABFlZxFZk81qhMjcDAAEC').then((auxid) => {
        setTimeout(() => {
            borrarchat = idChatPhoto.indexOf(auxid.chat.id);
            idChatPhoto.splice(borrarchat, 1);
            idPhoto.splice(borrarchat, 1)
        }, 60000);
        idChatPhoto.push(auxid.chat.id);
        idPhoto.push(auxid.message_id)
        });
    }
    else
    {
        bot.sendMessage(idChatPhoto[chatPos], "Has solicitado el comando muy pronto. Aqui tienes la ultima vez que el comando ha sido usado", {reply_to_message_id: idPhoto[chatPos]});
    }
}