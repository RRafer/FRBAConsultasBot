const request = require('request');
const { clientId } = require('../token');
const { clientSecret } = require('../token');

exports.execute = (bot, msg, match) => {
    
	let transporte;

	let cause = ['Causa desconocida', 'Otra causa', 'Problema tecnico', 'Huelga?', 'Manifestación', 'Accidente', 'Fiestas', 'Clima', 'Mantenimiento', 'Construcción', 'Actividad policial', 'Emergencia medica'];
	let effect = ['Sin servicio', 'Servicio reducido', 'Servicio con demoras', 'Desvio', 'Servicio adicional', 'Servicio modificado', 'Otro efecto', 'Efecto desconocido', ''];

	if(['trenes', 'tren'].includes(match[1].toLowerCase()))
		transporte = 'trenes';
	else if(['subtes', 'subte', 'metro'].includes(match[1].toLowerCase()))
		transporte = 'subtes';
	else if(['colectivo', 'colectivos', 'bondi'].includes(match[1].toLowerCase()))
		transporte = 'colectivos';
	else{
		bot.sendMessage(msg.chat.id, 'Solo es posible utilizar este comando con las palabras:\n• `Tren`\n• `Subte`\n• `Colectivo`', {parse_mode: 'Markdown', reply_to_message_id: msg.message_id});
		return;
	}
	
	request({
		url: `https://apitransporte.buenosaires.gob.ar/${transporte}/serviceAlerts?json=1&client_id=${clientId}&client_secret=${clientSecret}`,
		json: true
	}, (e, response, body) => {
		if(!e && response.statusCode === 200){
			switch(transporte){
			case 'subtes':
				if(body.entity.header_text){
					for(let i = 0; i < body.entity.header_text.lenght; i++){
						if(body.entity.header_text[i].language === 'es'){
							bot.sendMessage(msg.chat.id, `<b>${body.entity.header_text[i].text}</b>\n\n${body.entity.description_text[i].text}, debido a ${cause[body.entity.cause]}`, {parse_mode: 'HTML'});
						}		
					}
				}
				else{
					bot.sendMessage(msg.chat.id, 'Todas las lineas de subte se encuentran funcionando correctamente');
				}
				break;
			case 'trenes':
				if(body.entity.alert){
					for(let i = 0; i < body.entity.lenght; i++){
						if(body.entity.header_text.translation.language === 'es'){
							bot.sendMessage(msg.chat.id, `<b>${body.entity.alert.header_text.translation.text}</b>\n\n${body.entity.alert.description_text.text}, debido a ${cause[body.entity.alert.cause]}`, {parse_mode: 'HTML'});
						}		
					}
				}
				else{
					bot.sendMessage(msg.chat.id, 'Todas los trenes se encuentran funcionando correctamente');
				}
				break;
			case 'colectivos':
				if(body.entity.header_text){
					for(let i = 0; i < body.entity.header_text.lenght; i++){
						if(body.entity.header_text[i].language === 'es'){
							bot.sendMessage(msg.chat.id, `<b>${body.entity.header_text[i].text}</b>\n\n${body.entity.description_text[i].text}, debido a ${cause[body.entity.cause]}`, {parse_mode: 'HTML'});
						}		
					}
				}
				else{
					bot.sendMessage(msg.chat.id, 'No se ha reportado ningun incidente');
				}	
				break;
			}         	
		}
	});
};