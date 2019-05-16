const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';


exports.insertMessage = (msg) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('BotTelegram');
    if (err) throw err;
    db.collection('messages').insertOne(msg, (error, result) => {
      if (error) throw err;

      client.close();
    });
  });
};
