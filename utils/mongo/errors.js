const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

//Estructura:
//chatId - number
//errorMsg - string
//type - string

exports.logError = (error, chatId) => {
    console.log("HUBO UN ERROR: " + error);
    mongo.connect(url, (err, client) => {
        try
        {
            const db = client.db('telegram');
            const col = db.collection('errors');
            
            if(err || !error){
                client.close();
                return;
            }
            
            col.insertOne({'chatId': chatId, 'errorName': error.name, 'lineNumber': error.lineNumber, 'errorMsg': error.message}, (err, result) => {
                client.close();
    
                if(err) return;
            }).catch(e => console.log(e));
        }
        catch(e)
        {
            console.log(e);
        }        
    });
}