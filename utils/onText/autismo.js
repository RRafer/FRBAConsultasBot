var autismoid = 0;

exports.execute = (bot, msg) => {
                         //Catastrofico                                              Extremo
                         //Severo                                                    Muy alto
                         //Alto                                                      Moderado
    const afoto = ['AgADAQADcagxG103QUShJ6MUbp94kTUDCzAABK5Bb9yYzqSqKDIEAAEC','AgADAQADcKgxG103QUQEKPb4Kd2Wol1qDDAABJb5vSt4ZJPcjSYFAAEC',
                   'AgADAQADb6gxG103QURebVjZb7wf93N3DDAABMiZCdDYON1_hx8FAAEC','AgADAQADbqgxG103QURKqTz8_eESdoATFDAABN8q3Lw6C43_6qoCAAEC',
                   'AgADAQADbagxG103QUQm45ryhPzPC8_rCjAABF_LKtdfbL1b6gsEAAEC','AgADAQADWKgxGxI_QUSALO31gYZJeIZwDDAABA8GzpPULWDQmyUFAAEC'];

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
