const request = require('request');
const { clientId } = require('../token');
const { clientSecret } = require('../token');

exports.execute = (bot, msg, match) => {
	request({
		url: `https://apitransporte.buenosaires.gob.ar/ecobici/gbfs/stationStatus?client_id=${clientId}&client_secret=${clientSecret}`,
		json: true
	}, (e, response, body) => {
		if(!e && response.statusCode === 200){       
			let GetStation = body.data.stations.find(station => station.station_id === match[1]);
			let status = {'IN_SERVICE': 'En servicio', 'END_OF_LIFE': 'Sin servicio', 'PLANNED': 'Planeada'}[GetStation.status];
            
			if(!status) status = 'No definido';

			bot.sendMessage(msg.chat.id, `Estado de la estación: ${status}\nEsta instalada: ${GetStation.is_installed===1?'Si':'No'}\nPermite devoluciones: ${GetStation.is_returning===1?'Si':'No'}\nPermite rentar: ${GetStation.is_renting===1?'Si':'No'}\n\nBicicletas disponibles: ${GetStation.num_bikes_available}\nBicicletas desabilitadas: ${GetStation.num_bikes_disabled}\nEspacios disponibles: ${GetStation.num_docks_available}`);   	
		}
	});
};