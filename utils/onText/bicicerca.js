const request = require('request');
const {clientId} = require('../token');
const {clientSecret} = require('../token');


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}


function nearestStation(origin, station1, station2) {
    var dist1 = getDistanceFromLatLonInKm(origin.latitude, origin.longitude, station1.lat, station1.lon)
    var dist2 = getDistanceFromLatLonInKm(origin.latitude, origin.longitude, station2.lat, station2.lon)

    return dist1 < dist2 ? station1 : station2
}


function stationsWithBikes(station) {
    request({
        url: `https://apitransporte.buenosaires.gob.ar/ecobici/gbfs/stationStatus?client_id=${clientId}&client_secret=${clientSecret}`,
        json: true
    }, (e, response, body) => {

        if (!e && response.statusCode === 200) {

            return body.data.stations.filter(s => s.num_bikes_available > 0)
        }
    });
}

exports.execute = (bot, msg) => {
    if (msg.reply_to_message.location) {
        //bot.deleteMessage(msg.chat.id, msg.reply_to_message.message_id);

        request({
            url: `https://apitransporte.buenosaires.gob.ar/ecobici/gbfs/stationStatus?client_id=${clientId}&client_secret=${clientSecret}`,
            json: true
        }, (e, response, body) => {

            if (!e && response.statusCode === 200) {

                let stationsWithBikes = body.data.stations.filter(s => s.num_bikes_available > 0).map(s => s.station_id)

                request({
                    url: `https://apitransporte.buenosaires.gob.ar/ecobici/gbfs/stationInformation?client_id=${clientId}&client_secret=${clientSecret}`,
                    json: true
                }, (e1, response1, body1) => {

                    if (!e1 && response1.statusCode === 200) {

                        let locationUsr = msg.reply_to_message.location

                        let station = body1.data.stations
                            .filter(s => stationsWithBikes.includes(s.station_id))
                            .reduce((station1, station2) => nearestStation(locationUsr, station1, station2))

                        bot.sendLocation(msg.chat.id, station.lat, station.lon).then(value => {

                            //TODO: Deberiamos mandar la cantidad de bicis disponibles
                        })
                    }
                });
            }
        });
    }
};


