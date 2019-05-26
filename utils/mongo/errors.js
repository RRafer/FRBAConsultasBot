const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//Estructura:
//chatId - number
//errorMsg - string
//type - string

exports.logError = (error, chatId) => {
    mongo.connect(url, (err, client) => {
        const db = client.db('telegram');
        const col = db.collection('errors');
  
        if(err) return;
        
        col.insertOne({'chatId': chatId, 'errorMsg': error}, (err, result) => {
            client.close();

            if(err) return;
        });
      });
}