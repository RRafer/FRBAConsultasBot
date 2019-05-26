var autismoid = 0;

exports.execute = (bot, msg) => {
                         //Catastrofico                                              Extremo
                         //Severo                                                    Muy alto
                         //Alto                                                      Moderado
    const afoto = ['AgADAQADVagxG9iVWEfBGd3_oi5dAbAaFDAABA6aRQ1tE2q4KFgCAAEC','AgADAQADVqgxG9iVWEewbTuaghY_BBa_CjAABKKDnjeLmz6XvgQEAAEC',
                   'AgADAQADaqgxGwABWVhHFNdnkjgtaMcidQwwAASOOxj5UvvNdtDVBAABAg','AgADAQAD7qcxGyYkWUc7coxe4QhqEnFsDDAABGyaB_S3CKrJAAHgBAABAg',
                   'AgADAQADa6gxGwABWVhHBbWUKf3hQZRkBAswAATWEYRToX2MKS3kAwABAg','AgADAQADbKgxGwABWVhHT79nQu5RG_0wwAowAAQ1SJHg2KjA1P4GBAABAg'];

    if(msg.chat.id === -1001214086516){
        if(autismoid === 0){
            //         Redondea a entero    Numero random   Multiplico por 6 para que este incluido el ultimo nivel
            var nivelRandom = Math.floor(Math.random() * 6);
            var Autismo = bot.sendPhoto(msg.chat.id, afoto[nivelRandom]).then((autismo) => {
                setTimeout(() => {
                    autismoid = 0;
                }, 30000)
                autismoid = autismo.message_id;
            })
        }
        else{
            bot.sendMessage(msg.chat.id, "Ya se ha solicitado el autismo del dia. Se encuentra aquí", {reply_to_message_id: autismoid});
        }
    }
    else{
        bot.deleteMessage(msg.chat.id, msg.message_id);
        var borrar = bot.sendMessage(msg.chat.id, "No se puede ejecutar este comando en el actual grupo.\n\nEste mensaje se borrara en unos segundos.").then((borrar) =>{
            setTimeout(() => {
                bot.deleteMessage(borrar.chat.id, borrar.message_id);
            },30000)
        })
    }
}