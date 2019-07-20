const request = require('request');

exports.execute = (bot, msg, match) => {
	let clientId = '3e9d94f5047a4588a1aabe4d6ec32b43';
	let clientSecret = '1f50e11471644ecD91646D1eFf2F9D6a';
    
	let transporte;

	let cause = ['Causa desconocida', 'Otra causa', 'Problema tecnico', 'Huelga?', 'Manifestación', 'Accidente', 'Fiestas', 'Clima', 'Mantenimiento', 'Construcción', 'Actividad policial', 'Emergencia medica'];
	let effect = ['Sin servicio', 'Servicio reducido', 'Servicio con demoras', 'Desvio', 'Servicio adicional', 'Servicio modificado', 'Otro efecto', 'Efecto desconocido', ''];

	if(match[1] === 'trenes' || match[1] === 'tren')
		transporte = 'trenes';
	if(match[1] === 'subte' || match[1] === 'metro')
		transporte = 'subtes';

	request({
		url: `https://apitransporte.buenosaires.gob.ar/${transporte}/serviceAlerts?json=1&client_id=${clientId}&client_secret=${clientSecret}`,
		json: true
	}, function(e, response, body){
		if(!e && response.statusCode === 200){
			if(transporte === 'subtes'){
				if(body.entity.header_text){
					for(let i = 0; i < body.entity.header_text.lenght; i++){
						if(body.entity.header_text[i].language === 'es'){
							bot.sendMessage(msg.chat.id, `<b>${body.entity.header_text[i].text}</b>\n\n${body.entity.description_text[i].text}, debido a ${cause[body.entity.cause]}`, {parse_mode: 'HTML'});
						}		
					}
				}
				else{
					bot.sendMessage(msg.chat.id, 'Todas las lineas de subte se encuentra funcionando correctamente');
				}
			}
			if(transporte === 'trenes'){
				if(body.entity.alert){
					for(let i = 0; i < body.entity.lenght; i++){
						if(body.entity.header_text.translation.language === 'es'){
							bot.sendMessage(msg.chat.id, `<b>${body.entity.alert.header_text.translation.text}</b>\n\n${body.entity.alert.description_text.text}, debido a ${cause[body.entity.alert.cause]}`, {parse_mode: 'HTML'});
						}		
					}
				}		
			}           
			else{
				bot.sendMessage(msg.chat.id, 'Todas los trenes se encuentra funcionando correctamente');
			}
		}
	});
};