const request = require('request');
const { clientId } = require('../token');
const { clientSecret } = require('../token');

exports.execute = (bot, msg, match) => {    
	let transporte;

	if(['trenes', 'tren'].includes(match[1].toLowerCase()))
		transporte = 'trenes';
	else if(['subtes', 'subte', 'metro'].includes(match[1].toLowerCase()))
		transporte = 'subtes';
	else{
		bot.sendMessage(msg.chat.id, 'Solo es posible utilizar este comando con las palabras:\n• `Tren`\n• `Subte`', {parse_mode: 'Markdown', reply_to_message_id: msg.message_id});
		return;
	}
	
	request({
		url: `https://apitransporte.buenosaires.gob.ar/${transporte}/serviceAlerts?json=1&client_id=${clientId}&client_secret=${clientSecret}`,
		json: true
	}, (e, response, body) => {
		if(e || response.statusCode !== 200) return;

		let message = '';
		switch(transporte){
		case 'subtes':
			if(body.entity.header_text){
				for(let i = 0; i < body.entity.header_text.length; i++){
					if(body.entity.header_text[i].language === 'es'){
						if(body.entity.header_text[i].text !== body.entity.description_text[i].text){
							message = `<b>${body.entity.header_text[i].text}</b>\n${body.entity.description_text[i].text}\n\n`;
						}
						else
							message = `<b>${body.entity.header_text[i].text}</b>\n\n`;
					}		
				}
				bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'});
			}
			else
				bot.sendMessage(msg.chat.id, 'Todas las lineas de subte se encuentran funcionando correctamente');
			break;
		case 'trenes':
			if(body.entity){
				body.entity.forEach(tren => {
					if(tren.alert.header_text.translation.language === 'es'){
						if(tren.alert.header_text.translation.text !== tren.alert.description_text.translation.text)
							message = `${message}<b>${tren.alert.header_text.translation.text}</b>\n${tren.alert.description_text.text}\n\n`;
						else
							message = `${message}<b>${tren.alert.header_text.translation.text}</b>\n\n`;
					}
				});	
				bot.sendMessage(msg.chat.id, message, {parse_mode: 'HTML'});
			}
			else 
				bot.sendMessage(msg.chat.id, 'Todas los trenes se encuentran funcionando correctamente');
			break;
		}         	
	});
};