const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

exports.insertMessage = (msg) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('telegram');
    if(err) throw err;
    db.collection('messages').insertOne(msg, (error, result) => {
      if(error) throw err;

      client.close();
    });
  });
};

exports.insertUser = (userId, privateChatId) => {
  monog.connect(url, (err, client) => {
    const db = client.db('telegram');
    if(err) throw err;
    db.collection('user').insertOne({"userId": userId, "privateChatId": privateChatId}, (error, result) => {
      if(error) throw err;

      client.close();
    });
  });
}

exports.getPrivateChatId = userId => {
  mongo.connect(url, (err, client) => {
    const db = client.db('telegram');
    if(err) throw err;
    db.collection('user').find({"userId": userId}, (error, result) => {
      if(error) throw err;
      
      client.close();

      return result.privateChat;
    });
  });
};
