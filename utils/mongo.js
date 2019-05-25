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
 return new Promise((resolve, reject) => {
  mongo.connect(url, (err, client) => {
    const db = client.db('telegram');

    if(err)
    {
      reject()
    }

    db.collection('users').insertOne({"userId": userId, "privateChatId": privateChatId}, (error, result) => {
      if(error) 
      {
        reject();
      }

      client.close();
      resolve();
    });
  });
 });
}

exports.getPrivateChatId = userId => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');

      if(err)
      {
        reject()
      }

      db.collection('users').findOne({"userId": userId}, (error, result) => {
        if(error)
        {
          reject();
        }
  
        client.close();
        
        if(result == null)
        {
          reject();
        }
        else
        {
          resolve(result.privateChatId);
        }
      });
    });
  });
};

exports.hasStarted = userId => {
  return new Promise((resolve, reject) => {
    mongo.connect(url, (err, client) => {
      const db = client.db('telegram');

      if(err)
      {
        reject()
      }

      db.collection('users').findOne({"userId": userId}, (error, result) => {
        if(error)
        {
          reject();
        }
  
        client.close();        
        resolve(result != null);
      });
    });
  });
}
