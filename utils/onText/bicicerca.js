const request = require('request');
const { clientId } = require('../token');
const { clientSecret } = require('../token');

exports.execute = (bot, msg) => {
	if(msg.reply_to_message.location){
        bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);
		request({
			url: `https://apitransporte.buenosaires.gob.ar/ecobici/gbfs/stationInformation?client_id=${clientId}&client_secret=${clientSecret}`,
			json: true
		}, (e, response, body) => {
			if(!e && response.statusCode === 200){
                let lowdist, lat, lon;
                
				for(let i = 0; i < body.data.stations.length; i++){
					let lat1 = msg.reply_to_message.location.latitude;
					let lat2 = JSON.stringify(body.data.stations[i].lat);
					let lon1 = msg.reply_to_message.location.longitude;
					let lon2 = JSON.stringify(body.data.stations[i].lon);
                    
                    let R = 6371; // km (change this constant to get miles)
					let dLat = (lat2-lat1) * Math.PI / 180;
					let dLon = (lon2-lon1) * Math.PI / 180;
					let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		                    Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		                    Math.sin(dLon/2) * Math.sin(dLon/2);
					let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                    let d = R * c;
                    
                    console.log(R);
                    console.log(dLat);
                    console.log(dLon);
                    console.log(a);
                    console.log(c);
                    console.log(d);
                    
					if(d < lowdist){
                        lowdist = d;
						lat = lat2;
                        lon = lon2;
					}
                }		
			}
		});
	}
    
};