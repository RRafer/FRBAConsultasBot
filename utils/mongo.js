const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';


exports.insertMessage =(msg) =>{
    mongo.connect(url, (err, client) => {


        const db = client.db('BotTelegram');

        db.collection("messages").insertOne(msg, (err, res) => {
            if (err) throw err;

            client.close();

        });
    });
}